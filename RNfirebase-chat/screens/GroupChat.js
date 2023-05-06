import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext
} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext'
import { auth, database } from '../config/firebase';
import { getDocs } from 'firebase/firestore';

export default function GroupChat({ route, navigation }) {
    const [messages, setMessages] = useState([]);
    const [groupChat, setGroupChat] = useState(null);
    const { groupId } = route.params;
    const { user: currentUser } = useContext(AuthenticatedUserContext);
    const [currentUsername, setCurrentUsername] = useState(null);
    console.log(currentUsername, "current username<<<")
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
            return getUsername
        }
        fetchUsername().then(username => setCurrentUsername(username))
    }, [currentUser]);

    async function getGroupChatData(groupId) {
        const groupChatsCollectionRef = collection(database, 'groupChats');
        const q = query(groupChatsCollectionRef, where('__name__', '==', groupId));
        const querySnapshot = await query(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            return {
                _id: doc.id,
                name: data.groupName,
                language: data.groupLanguage,
                members: data.members,
            };
        }
    }

    useEffect(() => {
        async function fetchGroupChatData() {
            const data = await getGroupChatData(groupId);
            setGroupChat(data);
        }

        fetchGroupChatData();
    }, [groupId]);

    const mergeMessages = (oldMessages, newMessages) => {
        const allMessages = [...oldMessages, ...newMessages];
        const uniqueMessages = allMessages.filter(
            (message, index, self) =>
                index === self.findIndex((m) => m._id === message._id)
        );

        return uniqueMessages.sort((a, b) => b.createdAt - a.createdAt);
    };

    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{
                        marginRight: 10
                    }}
                    onPress={onSignOut}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    useEffect(() => {
        if (!groupChat) {
            return;
        }

        const collectionRef = collection(database, 'chats');
        const q = query(
            collectionRef,
            orderBy('createdAt', 'desc'),
            where('groupId', '==', groupId)
        );

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const fetchedMessages = querySnapshot.docs
                .map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                    groupId: doc.data().groupId,
                }))
                .filter(message => {
                    return message.groupId === groupId;
                });
            setMessages((messages) => mergeMessages(messages, fetchedMessages));
        });

        return () => {
            unsubscribe();
        };
    }, [groupId, groupChat]);

    const onSend = useCallback((messages = []) => {
        if (!currentUser) {
            console.error('User data not loaded yet. Please try again later.');
            return;
        }

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user } = messages[0];

        // Add the message to the chats collection in Firestore
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user: {
                _id: currentUser.email,
                username: currentUsername,
                avatar: currentUser.avatar || 'https://i.pravatar.cc/300',
            },
            groupChatId: groupId, // Add groupChatId field
        });
    }, [currentUser, groupId, currentUsername]);


    useEffect(() => {
        const messagesCollectionRef = collection(database, 'groupChats', groupId, 'messages');

        const q = query(
            messagesCollectionRef,
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const fetchedMessages = querySnapshot.docs
                .map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                }));

            setMessages((messages) => mergeMessages(messages, fetchedMessages));
        });

        return () => {
            unsubscribe();
        };
    }, [groupId]);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: currentUser.email,
                username: currentUser.username,
                avatar: currentUser.avatar || 'https://i.pravatar.cc/300'
            }}
        />
    );
}