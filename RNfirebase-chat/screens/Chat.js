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
  getDocs
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext'
import { auth, database } from '../config/firebase';
import { logoutUser } from '../stores/usersSlice';
import { useDispatch } from 'react-redux';

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { recipientEmail, recipientName } = route.params;
  const { user: currentUser } = useContext(AuthenticatedUserContext);
  const [currentUserData, setCurrentUserData] = useState(null);

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

  const onSignOut = () => {
    dispatch(logoutUser());
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
    const collectionRef = collection(database, 'personalChats');
    const currentUserEmail = auth.currentUser.email;

    const q = query(
      collectionRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const fetchedMessages = querySnapshot.docs
        .map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
          recipient: doc.data().recipient,
        }))
        .filter(message => {
          return (
            (message.user._id === currentUserEmail &&
              message.recipient === recipientEmail) ||
            (message.user._id === recipientEmail &&
              message.recipient === currentUserEmail)
          );
        });
      setMessages(messages => mergeMessages(messages, fetchedMessages));
    });

    return () => {
      unsubscribe();
    };
  }, [recipientEmail]);

  const onSend = useCallback((messages = []) => {
    if (!currentUserData) {
      console.error('User data not loaded yet. Please try again later.');
      return;
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'personalChats'), {
      _id,
      createdAt,
      text,
      user: {
        _id: currentUser.email,
        username: currentUserData.username,
        avatar: currentUserData.avatar || 'https://i.pravatar.cc/300',
      },
      recipient: recipientEmail,
      recipientName: recipientName,
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