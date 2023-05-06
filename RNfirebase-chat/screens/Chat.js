import React, {
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet } from 'react-native';
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
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext'
import { auth, database } from '../config/firebase';
import bg from '../assets/BG.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PopChatMenu } from './HeadersChat/PopChatMenu';

export default function Chat({ route }) {
  const [messages, setMessages] = useState([]);
  const { recipientEmail, recipientName } = route.params;
  const { user: currentUser } = useContext(AuthenticatedUserContext);
  const [currentUserData, setCurrentUserData] = useState(null);
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

  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={bg} style={{ flex: 1 }}>
        <View style={styles.headers}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
              <AntDesign name="arrowleft" size={36} color="black" />
            </TouchableOpacity>
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsu34yqIKdjK5cAWEcuUq3ryD30iiqd2ArQ' }} style={styles.image} />
            <Text style={{ fontStyle: 'italic', fontSize: 25 }}>{currentUserData?.username}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <MaterialIcons name="video-call" size={36} color="black" />
            <PopChatMenu />
          </View>
        </View>
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headers: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 50,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
    flex: 0.06,
    justifyContent: 'space-between'
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth

  },
  send: {
    backgroundColor: 'royalblue',
    padding: 7,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: 10
  },
})