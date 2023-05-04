import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { signOut } from 'firebase/auth';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import { doc, getDoc } from 'firebase/firestore';

function ChatList({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [chats, setChats] = useState([]);

  async function getUserDataByEmail(email) {
    const userDocRef = doc(database, 'users', email);
    const userDoc = await getDoc(userDocRef);
    console.log(userDocRef)
    return userDoc.exists()
      ? {
        username: userDoc.data().username,
        avatar: userDoc.data().avatar,
      }
      : { username: email, avatar: '' };
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

  const unsubscribe = onSnapshot(q, async querySnapshot => {
    const chatsData = {};

    for (const doc of querySnapshot.docs) {
      const chat = doc.data();
      console.log(chat, "<<< recipient data")

      if (chat.user._id === user.email) {
        if (!chatsData[chat.recipient]) {
          if (!chat.recipientName) {
            const recipientData = await getUserDataByEmail(chat.recipient);
            chat.recipientName = recipientData.username;
            chat.recipientAvatar = recipientData.avatar;
          }
          chatsData[chat.recipient] = [];
        }

        chatsData[chat.recipient].push(chat);
      }
    }

    setChats(Object.values(chatsData).map(chatList => chatList[0]));
  });

  return () => unsubscribe();
}, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
  <FlatList
    data={chats}
    keyExtractor={item => item._id}
    renderItem={({ item }) => {
      // console.log(item, "<<<< ITEM");
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
          }}
          onPress={async () => {
            const recipientData = await getUserDataByEmail(item.recipient);
            navigation.navigate('Chat', {
              recipientEmail: item.recipient,
              recipientName: recipientData.username,
            });
          }}
        >
          {/* <Image
            source={{ uri: item.recipientAvatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          /> */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.recipientName}</Text>
            <Text style={{ fontSize: 16 }}>{item.text}</Text>
          </View>
        </TouchableOpacity>
      );
    }}
  />
</View>
  );
}

export default ChatList;
