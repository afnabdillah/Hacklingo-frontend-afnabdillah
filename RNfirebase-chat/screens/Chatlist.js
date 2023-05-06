import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
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
    return userDoc.exists()
      ? {
        username: userDoc.data().username,
        avatar: userDoc.data().avatar,
      }
      : { username: email, avatar: '' };
  }



  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async querySnapshot => {
      const chatsData = {};

      for (const doc of querySnapshot.docs) {
        const chat = doc.data();

        let targetUser;

        if (chat.user._id === user.email) {
          targetUser = chat.recipient;
        } else if (chat.recipient === user.email) {
          targetUser = chat.user._id;
        } else {
          continue;
        }

        if (!chatsData[targetUser]) {
          if (!chat.recipientName) {
            const recipientData = await getUserDataByEmail(targetUser);
            chat.recipientName = recipientData.username;
            chat.recipientAvatar = recipientData.avatar;
          }
          chatsData[targetUser] = [];
        }

        chatsData[targetUser].push(chat);
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
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={async () => {
                const recipientEmail = item.user._id === user.email ? item.recipient : item.user._id;
                const recipientName = item.user._id === user.email ? item.recipientName : item.user.username;
                const senderEmail = item.user._id === user.email ? user.email : item.recipient
                navigation.navigate('Chat', {
                  recipientEmail: recipientEmail,
                  recipientName: recipientName,
                  senderEmail: senderEmail
                });
              }}
            >
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsu34yqIKdjK5cAWEcuUq3ryD30iiqd2ArQ' }}
                style={styles.image}
              />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={styles.name}>{item.recipient === user.email ? item.user.username : item.recipientName}</Text>
                  <Text style={styles.subTitle}>3 day</Text>
                </View>
                <Text numberOfLines={2} style={styles.subTitle}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70

  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,

  },

  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',

  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',

  },
  subTitle: {
    color: 'gray',
  },



})


export default ChatList;