import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';

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
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.chatId}
        renderItem={({ item }) => {
          const lastMessage = item.messages[item.messages.length - 1];
          const otherUser = item.users.find(u => u.email !== user.email);
          console.log(otherUser, "<<<< item")
          return (
            <TouchableOpacity
              style={styles.chatRow}
              onPress={() => {
                navigation.navigate('Chat', {
                  recipientEmail: otherUser.email,
                  recipientName: otherUser.username,
                });
              }}
            >
              <Text style={styles.chatName}>
                {otherUser.username}
              </Text>
              <Text style={styles.chatDate}>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(item.createdAt)}
              </Text>
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
    flex: 1,
    backgroundColor: 'white'
  },
  chatRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  chatName: {
    fontSize: 18
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  createGroupButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChatList;
