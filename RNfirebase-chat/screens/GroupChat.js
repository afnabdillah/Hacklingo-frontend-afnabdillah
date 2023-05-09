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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PopChatMenu } from './HeadersChat/PopChatMenu';
import * as ImagePicker from 'expo-image-picker';

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

    const goToVideoChat = () => {
        navigation.navigate("Video Chat", { roomId: groupId, username: 'jun' })
    }
    const selectImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });
            if (!result.canceled) {
                const formData = new FormData();
                formData.append('file', {
                    uri: Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                });
                const response = await fetch('https://example.com/upload-image', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={bg} style={{ flex: 1 }}>
                <View style={styles.headers}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
                            <AntDesign name="arrowleft" size={30} color="black" />
                        </TouchableOpacity>
                        <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.image} />
                        <Text style={{ fontStyle: 'italic', fontSize: 25 }}>{groupName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingRight: 10 }}>
                        <TouchableOpacity>
                            <MaterialIcons onPress={goToVideoChat} name="video-call" size={36} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={true}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: currentUser.email,
                        username: currentUser.username,
                        avatar: currentUser.avatar || 'https://i.pravatar.cc/300'
                    }}
                    renderActions={(props) => (
                        <Actions
                            {...props}
                            containerStyle={{
                                position: "absolute",
                                right: 50,
                                bottom: 5,
                                zIndex: 9999,
                            }}
                            onPressActionButton={selectImage}
                            icon={() => (
                                <Ionicons name="camera" size={30} color={'grey'} />
                            )}
                        />
                    )}
                    timeTextStyle={{ right: { color: 'grey' } }}
                    renderSend={(props) => {
                        const { text, messageIdGenerator, user, onSend } = props;
                        return (
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 40,
                                    backgroundColor: 'primary',
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 5,
                                    paddingRight: 5
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
                                    color={'black'}
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
                    renderBubble={(props) => (
                        <Bubble
                            {...props}
                            textStyle={{ right: { color: 'grey' } }}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: 'white',
                                },
                                right: {
                                    backgroundColor: '#dcf8c6',
                                },
                            }}
                        />
                    )}
                // renderMessageImage={(props) => {
                //   console.log(props, "????????");
                //   return (
                //     <View style={{ borderRadius: 15, padding: 2 }}>
                //       <TouchableOpacity
                //         onPress={() => {
                //           setModalVisible(true);
                //           setSeletedImageView(props.currentMessage.image);
                //         }}
                //       >
                //         <Image
                //           resizeMode="contain"
                //           style={{
                //             width: 200,
                //             height: 200,
                //             padding: 6,
                //             borderRadius: 15,
                //             resizeMode: "cover",
                //           }}
                //           source={{ uri: props.currentMessage.image }}
                //         />
                //         {selectedImageView ? (
                //           <ImageView
                //             imageIndex={0}
                //             visible={modalVisible}
                //             onRequestClose={() => setModalVisible(false)}
                //             images={[{ uri: selectedImageView }]}
                //           />
                //         ) : null}
                //       </TouchableOpacity>
                //     </View>
                //   );
                // }}
                />
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
