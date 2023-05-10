import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useLayoutEffect
} from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet, Button, Platform } from 'react-native';
import { Actions, Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext'
import { auth, database } from '../config/firebase';
import { logoutUser } from '../stores/usersSlice';
import { useDispatch } from 'react-redux';
import bg from '../assets/BG.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PopChatMenu } from './HeadersChat/PopChatMenu';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';


export default function Chat({ route }) {

  const selectDoc = async () => {
    try {
      const picker = await DocumentPicker.getDocumentAsync()
      console.log(picker, "<<<<<>");
    } catch (error) {
      console.log(error);
    }
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


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");

  const [messages, setMessages] = useState([]);
  const { recipientEmail, recipientName } = route.params;
  const { user: currentUser } = useContext(AuthenticatedUserContext);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const dispatch = useDispatch();


  async function getUserDataByEmail(email) {
    const usersCollectionRef = collection(database, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      return null;
    }
  }

  useEffect(() => {
    async function fetchCurrentUserData() {
      const userData = await getUserDataByEmail(currentUser.email);
      setCurrentUserData(userData);
    }

    fetchCurrentUserData();
  }, [currentUser]);

  const mergeMessages = (oldMessages, newMessages) => {
    const allMessages = [...oldMessages, ...newMessages];
    const uniqueMessages = allMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m._id === message._id)
    );

    return uniqueMessages.sort((a, b) => b.createdAt - a.createdAt);
  };
  const generateRoomId = (email1, email2) => {
    return email1 < email2
      ? `${email1}_${email2}`
      : `${email2}_${email1}`;
  };

  useEffect(() => {
    const createRoomId = generateRoomId(currentUser.email, recipientEmail);
    const roomDocRef = doc(database, "personalChats", createRoomId);

    const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const fetchedMessages = docSnapshot.data().messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toDate(),
        }));
        setMessages((messages) => mergeMessages(messages, fetchedMessages));
      } else {
        setMessages([]);
      }
    });
    setRoomId(createRoomId)
    return () => {
      unsubscribe();
    };
  }, [recipientEmail, currentUser.email]);
  const onSend = useCallback(async (messages = []) => {
    if (!currentUserData) {
      console.error("User data not loaded yet. Please try again later.");
      return;
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const roomId = generateRoomId(currentUser.email, recipientEmail);


    const roomDocRef = doc(database, "personalChats", roomId);
    const roomDocSnapshot = await getDoc(roomDocRef);

    if (!roomDocSnapshot.exists()) {
      await setDoc(roomDocRef, {
        users: [
          {
            email: currentUser.email,
            username: currentUserData.username,
            avatar: currentUserData.avatar || "https://i.pravatar.cc/300",
          },
          {
            email: recipientEmail,
            username: recipientName,
            avatar: "https://i.pravatar.cc/300", // Set the recipient avatar if available
          },
        ],
        messages: [],
      });
    }
    const message = {
      _id: messages[0]._id,
      createdAt: messages[0].createdAt,
      text: messages[0].text,
      user: {
        _id: currentUser.email,
        username: currentUserData.username,
        avatar: currentUserData.avatar || "https://i.pravatar.cc/300",
      },
    };

    await updateDoc(roomDocRef, {
      messages: arrayUnion(message),
    });
  }, [currentUserData]);
  const navigation = useNavigation()
  const goToVideoChat = () => {
    navigation.navigate("Video Chat", { roomId: roomId, username: currentUserData.username })
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={bg} style={{ flex: 1 }}>
        <View style={styles.headers}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
              <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>
            <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.image} />
            <Text style={{ fontStyle: 'italic', fontSize: 25 }}>{recipientName}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
            <TouchableOpacity>
              <MaterialIcons onPress={goToVideoChat} name="video-call" size={36} color="black" />
            </TouchableOpacity>
            <PopChatMenu name={recipientName} email={recipientEmail} />
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