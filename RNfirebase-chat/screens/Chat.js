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
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext'
import { auth, database } from '../config/firebase';

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { recipientEmail, recipientName } = route.params;
  const { user: currentUser } = useContext(AuthenticatedUserContext);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [roomId, setRoomId] = useState(null);

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