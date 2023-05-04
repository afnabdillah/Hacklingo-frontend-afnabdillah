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
      where('user._id', '==', currentUserEmail),
      where('recipient', '==', recipientEmail),
      orderBy('createdAt', 'desc')
    );
  
    const q2 = query(
      collectionRef,
      where('user._id', '==', recipientEmail),
      where('recipient', '==', currentUserEmail),
      orderBy('createdAt', 'desc')
    );
  
    const unsubscribe1 = onSnapshot(q, querySnapshot => {
      const messages1 = querySnapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));
      setMessages(messages => GiftedChat.append(messages, messages1));
    });
  
    const unsubscribe2 = onSnapshot(q2, querySnapshot => {
      const messages2 = querySnapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));
      setMessages(messages => GiftedChat.append(messages, messages2));
    });
  
    return () => {
      unsubscribe1();
      unsubscribe2();
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
      recipient: recipientEmail // Add the recipient field here
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
