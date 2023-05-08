import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import { Image } from 'react-native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


function ChatList() {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    if (!user) return;
    const personalChatsRef = collection(database, 'personalChats');
    const personalChatsQuery = query(personalChatsRef);
    const personalChatsUnsubscribe = onSnapshot(personalChatsQuery, snapshot => {
      const personalChatsData = snapshot.docs.map(doc => ({ ...doc.data(), chatId: doc.id, isGroup: false }));
      const userChats = personalChatsData.filter(chat => {
        return chat.users.some(userObj => userObj.email === user.email);
      });


      setChats(prevChats => mergeChatLists(prevChats, userChats, user.email));
    });

    return () => {
      personalChatsUnsubscribe();
    };
  }, [user]);

  const mergeChatLists = (prevChats, newChats, currentUserEmail) => {
    const mergedChats = newChats
      .map(chat => {
        const recipient = chat.users.find(user => user !== currentUserEmail);
        return { ...chat, recipient };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return mergedChats;
  };


  // console.log(chats, '<<<< chats');
  return (
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#fff' }}>
      <FlatList
        data={chats}
        keyExtractor={item => item.chatId}
        renderItem={({ item }) => {
          const lastMessage = item.messages[item.messages.length - 1];
          const otherUser = item.users.find(u => u.email !== user.email);
          console.log(otherUser, "<<<< otheruser")
          console.log(lastMessage, "<<<< item")
          console.log(item, "<<<< lastmessage")
          return (
            <TouchableOpacity style={styles.container} onPress={() => {
              navigation.navigate('Chat', { recipientEmail: otherUser.email, recipientName: otherUser.username });
            }}>
              <Image
                source={{ uri: otherUser.avatar }}
                style={styles.image}
              />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={styles.name}>{otherUser.username}</Text>
                  <Text style={styles.subTitle}>{dayjs(item.createdAt).fromNow(false)}</Text>
                </View>
                <Text style={styles.subTitle}>{lastMessage.text}</Text>
              </View>
            </TouchableOpacity>
          )
        }
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: 'center'
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
    fontSize: 20,
    fontStyle: 'italic'
  },
  subTitle: {
    color: 'gray',
    fontStyle: 'italic',
    marginBottom: 5,
    marginRight: 5
  },

})


export default ChatList;
