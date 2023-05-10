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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';



export default function GroupChat({ route, navigation }) {
    const [userEmail, setUserEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);
    const { groupId, groupName } = route.params;
    const { user: currentUser } = useContext(AuthenticatedUserContext);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [groupLanguage, setGroupLanguage] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupAdmin, setGroupAdmin] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const email = await AsyncStorage.getItem("email");
            const username = await AsyncStorage.getItem("username");
            setUserEmail(email);
            setUsername(username);
        };

        fetchUserData();
    }, []);
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
            if (!userEmail) {
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
                    _id: userEmail,
                    username: username,
                    avatar: currentUser?.avatar || 'https://i.pravatar.cc/300',
                },
            };

            const groupDocRef = doc(database, 'groupChats', groupId);
            updateDoc(groupDocRef, {
                messages: arrayUnion(messageObj),
            });
        },
        [userEmail, groupId, username]
    );
    const renderUsername = (currentMessage) => {
        return (
            <Text style={{ fontSize: 12, color: '#777', marginBottom: 5 }}>
                {currentMessage.user.username}
            </Text>
        );
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Video Chat', { roomId: groupId, username: username })
                        }
                        style={{ marginRight: 10 }}
                    >
                        <MaterialIcons name="video-call" size={24} color="#0D47A1" />
                    </TouchableOpacity>
                    {userEmail && groupAdmin && userEmail === groupAdmin && (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('RequestJoin', { groupId })
                                }
                                style={{ marginRight: 10 }}
                            >
                                <Entypo name="add-user" size={24} color="#0D47A1" />
                            </TouchableOpacity>
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
                            >
                                <FontAwesome name="gear" size={24} color="#0D47A1" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ),
        });
    }, [navigation, groupId, groupName, groupLanguage, groupMembers, userEmail, groupAdmin]);





    const renderBubble = (props) => {
        const isCurrentUser = props.currentMessage.user._id === userEmail;
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
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userEmail,
                    username: username,
                    avatar: currentUser?.avatar || 'https://i.pravatar.cc/300',
                }}
                renderBubble={renderBubble}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});