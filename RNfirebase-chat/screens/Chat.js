import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { auth, database } from '../config/firebase';

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const recipientEmail = route.params?.recipientEmail || null;
  const recipientUsername = route.params?.recipientUsername || null;
  
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
    const collectionRef = collection(database, 'chats');
    const currentUserEmail = auth.currentUser.email;
  
    const q = query(
      collectionRef,
      where('user._id', 'in', [currentUserEmail, recipientEmail]),
      where('recipient', 'in', [currentUserEmail, recipientEmail]),
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
        .filter(
          message =>
            (message.user._id === currentUserEmail &&
              message.recipient === recipientEmail) ||
            (message.user._id === recipientEmail &&
              message.recipient === currentUserEmail)
        );
      setMessages((messages) => mergeMessages(messages, fetchedMessages));
    });
  
    return () => {
      unsubscribe();
    };
  }, []);  

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user,
      recipient: recipientEmail,
      recipientName: recipientUsername
    });
  }, []);
  
  
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300'
      }}
    />
  );
}
