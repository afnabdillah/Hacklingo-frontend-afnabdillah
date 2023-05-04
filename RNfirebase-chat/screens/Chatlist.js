import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { signOut } from 'firebase/auth';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import { doc, getDoc } from 'firebase/firestore';

function ChatList({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [chats, setChats] = useState([]);

  async function getUsernameByEmail(email) {
    const userDocRef = doc(database, 'users', email);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().username : email;
  }

  async function onSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

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
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const chatsData = {};
      querySnapshot.forEach(doc => {
        const chat = doc.data();
        if (chat.user._id === user.email) {
          if (!chatsData[chat.recipient]) {
            chatsData[chat.recipient] = [];
          }
          chatsData[chat.recipient].push(chat);
        }
      });
      setChats(Object.values(chatsData).map(chatList => chatList[0]));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={chats}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={async () => {
              const recipientName = await getUsernameByEmail(item.user._id);
              navigation.navigate('Chat', { recipientEmail: item.user._id, recipientName });
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.recipientName}</Text>
            <Text style={{ fontSize: 16 }}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default ChatList;
