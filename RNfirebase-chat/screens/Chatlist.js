import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { signOut } from 'firebase/auth';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import { doc, getDoc } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

function ChatList({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
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
    const chatsCollectionRef = collection(database, 'chats');
    const groupChatsCollectionRef = collection(database, 'groupChats');

    const chatsQuery = query(chatsCollectionRef, orderBy('createdAt', 'desc'));
    const groupChatsQuery = query(groupChatsCollectionRef);

    const unsubscribeChats = onSnapshot(chatsQuery, async querySnapshot => {
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

    const unsubscribeGroupChats = onSnapshot(groupChatsQuery, async querySnapshot => {
      const groupChatsData = {};

      for (const doc of querySnapshot.docs) {
        const groupChat = doc.data();
        groupChatsData[doc.id] = groupChat;
      }

      setGroupChats(groupChatsData);
    });

    return () => {
      unsubscribeChats();
      unsubscribeGroupChats();
    };
  }, [user]);
  return (
    <View style={styles.container}>
      <FlatList
        data={[...chats, ...Object.entries(groupChats).map(([id, value]) => ({ _id: id, ...value }))]}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          if (item.groupName) {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  navigation.navigate('Group Chat', {
                    groupId: item._id,
                    groupName: item.groupName,
                  });
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.groupName}</Text>
              </TouchableOpacity>
            );
          } else {
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
                {/* <Image
            source={{ uri: item.recipientAvatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          /> */}
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.recipient === user.email ? item.user.username : item.recipientName}</Text>
                  <Text style={{ fontSize: 16 }}>{item.text}</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
      />

      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => navigation.navigate('CreateGroupChat')}
      >
        <Text style={styles.createGroupButtonText}>Create Group Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
});


export default ChatList;