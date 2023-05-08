import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext,
} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where,
    updateDoc,
    arrayUnion,
    doc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import { auth, database } from '../config/firebase';
import { getDocs } from 'firebase/firestore';

export default function GroupChat({ route, navigation }) {
    const [messages, setMessages] = useState([]);
    const { groupId, groupName } = route.params;
    const { user: currentUser } = useContext(AuthenticatedUserContext);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [groupLanguage, setGroupLanguage] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupAdmin, setGroupAdmin] = useState(null);


    async function getUsernameByEmail(email) {
        const usersCollectionRef = collection(database, 'users');
        const q = query(usersCollectionRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            const doc = querySnapshot.docs[0];
            return doc.data().username;
        }
    }

    useEffect(() => {
        async function fetchUsername() {
            const getUsername = await getUsernameByEmail(currentUser.email);
            return getUsername;
        }
        fetchUsername().then((username) => setCurrentUsername(username));
    }, [currentUser]);

    const mergeMessages = (oldMessages, newMessages) => {
        const allMessages = [...oldMessages, ...newMessages];
        const uniqueMessages = allMessages.filter(
            (message, index, self) =>
                index === self.findIndex((m) => m._id === message._id)
        );

        return uniqueMessages.sort((a, b) => b.createdAt - a.createdAt);
    };
    useEffect(() => {
        if (!groupId) {
            return;
        }

        const groupDocRef = doc(database, 'groupChats', groupId);

        const unsubscribe = onSnapshot(groupDocRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data) {
                if (data.messages) {
                    const fetchedMessages = data.messages.map((message) => ({
                        _id: message._id,
                        createdAt: message.createdAt.toDate(),
                        text: message.text,
                        user: message.user,
                    }));
                    setMessages((messages) => mergeMessages(messages, fetchedMessages));
                } else {
                    setMessages([]);
                }
                setGroupLanguage(data.languages ? data.languages.join(', ') : '');
                setGroupMembers(data.users || []);
                setGroupAdmin(data.admin || null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, [groupId]);


    const onSend = useCallback(
        (messages = []) => {
            if (!currentUser) {
                console.error(
                    'User data not loaded yet. Please try again later.'
                );
                return;
            }

            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, messages)
            );
            const { _id, createdAt, text, user } = messages[0];
            const messageObj = {
                _id,
                createdAt,
                text,
                user: {
                    _id: currentUser.email,
                    username: currentUsername,
                    avatar: currentUser.avatar || 'https://i.pravatar.cc/300',
                },
            };

            const groupDocRef = doc(database, 'groupChats', groupId);
            updateDoc(groupDocRef, {
                messages: arrayUnion(messageObj),
            });
        },
        [currentUser, groupId, currentUsername]
    );
    const renderUsername = (currentMessage) => {
        return (
            <Text style={{ fontSize: 12, color: '#777', marginBottom: 5 }}>
                {currentMessage.user.username}
            </Text>
        );
    };
    useLayoutEffect(() => {
        if (currentUser && groupAdmin && currentUser.email === groupAdmin) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('CreateGroupChat', {
                                groupId,
                                groupName,
                                groupLanguage,
                                groupMembers,
                                editMode: true,
                            })
                        }
                        style={{ marginRight: 10 }}
                    >
                        <Text style={{ color: '#0D47A1', fontSize: 16 }}>Edit Group</Text>
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({ headerRight: null });
        }
    }, [navigation, groupId, groupName, groupLanguage, groupMembers, currentUser, groupAdmin]);


    const renderBubble = (props) => {
        const isCurrentUser = props.currentMessage.user._id === currentUser.email;
        const bubbleBackgroundColor = isCurrentUser ? '#1f75fe  ' : '#fffff';

        return (
            <View>
                {!isCurrentUser && renderUsername(props.currentMessage)}
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: { backgroundColor: bubbleBackgroundColor },
                        right: { backgroundColor: bubbleBackgroundColor },
                    }}
                />
            </View>
        );
    };

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: currentUser.email,
                username: currentUser.username,
                avatar: currentUser.avatar || 'https://i.pravatar.cc/300',
            }}
            renderBubble={renderBubble}
        />
    );
}
