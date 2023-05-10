import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext,
} from 'react';
import bg from '../assets/BG.png'
import { TouchableOpacity, Text, View, ImageBackground, StyleSheet, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Actions } from 'react-native-gifted-chat';
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
import { MaterialIcons, Entypo, FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PopChatMenu } from './HeadersChat/PopChatMenu';
import * as ImagePicker from 'expo-image-picker';

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
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("ChatList")} style={{ paddingRight: 10 }}>
                        <AntDesign name="arrowleft" size={30} color="black" />
                    </TouchableOpacity>
                    <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={{ width: 45, height: 45, borderRadius: 30, }} />
                    <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 20 }}>{groupName}</Text>
                </View>
            ),
            headerLeft: () => {
                <View >
                </View>
            }
        });
    }, [navigation, groupId, groupName, groupLanguage, groupMembers, userEmail, groupAdmin]);

    const renderBubble = (props) => {
        const isCurrentUser = props.currentMessage.user._id === userEmail;
        const bubbleBackgroundColor = isCurrentUser ? '#dcf8c6  ' : 'grey';

        return (
            <View>
                {!isCurrentUser && renderUsername(props.currentMessage)}
                <Bubble
                    {...props}
                    textStyle={{ right: { color: "grey" } }}
                    wrapperStyle={{
                        left: { backgroundColor: bubbleBackgroundColor },
                        right: { backgroundColor: bubbleBackgroundColor },
                    }}
                />
            </View>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={bg} style={{ flex: 1 }}>
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
                        renderActions={(props) => (
                            <Actions
                                {...props}
                                containerStyle={{
                                    position: "absolute",
                                    right: 50,
                                    bottom: 5,
                                    zIndex: 9999,
                                }}
                                // onPressActionButton={selectImage}
                                icon={() => <Ionicons name="camera" size={30} color={"grey"} />}
                            />
                        )}
                        timeTextStyle={{ right: { color: "grey" } }}
                        renderSend={(props) => {
                            const { text, messageIdGenerator, user, onSend } = props;
                            return (
                                <TouchableOpacity
                                    style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: 40,
                                        backgroundColor: "primary",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 5,
                                        paddingRight: 5,
                                    }}
                                    onPress={() => {
                                        if (text && onSend) {
                                            onSend(
                                                {
                                                    text: text.trim(),
                                                    user,
                                                    _id: messageIdGenerator(),
                                                },
                                                true
                                            );
                                        }
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={text && onSend ? "send" : "microphone"}
                                        size={23}
                                        color={"black"}
                                    />
                                </TouchableOpacity>
                            );
                        }}
                        renderInputToolbar={(props) => (
                            <InputToolbar
                                {...props}
                                containerStyle={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginBottom: 2,
                                    borderRadius: 20,
                                    paddingTop: 5,
                                }}
                            />
                        )}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headers: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 50,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 10,
        flex: 0.06,
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        padding: 5,
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 50,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth

    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 10
    },
})
