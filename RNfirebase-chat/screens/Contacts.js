import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';

function Contacts({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const { user } = useContext(AuthenticatedUserContext);
  async function getUsernameByEmail(email) {
    const userDocRef = doc(database, 'users', email);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().username : email;
  }

  useEffect(() => {
    async function fetchContacts() {
      const currentUserEmail = auth.currentUser.email;
      const usersSnapshot = await getDocs(collection(database, 'users'));
      const usersData = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => user.email !== currentUserEmail); // Filter out current user
      // console.log(usersData, "<<< ini data users")
      setContacts(usersData);
    }


    fetchContacts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={async () => {
              const recipientName = await getUsernameByEmail(item.id);
              navigation.navigate('Chat', { recipientEmail: item.email, recipientName: item.username, senderEmail: user.email });
            }}
          >
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsu34yqIKdjK5cAWEcuUq3ryD30iiqd2ArQ' }}
              style={styles.image}
            />
            <View style={styles.content}>
              <Text numberOfLines={1} style={styles.name}>{item.username}</Text>
              <Text numberOfLines={2} style={styles.subTitle}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
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

  name: {
    fontWeight: 'bold',
  },

  content: {
  },

  subTitle: {
    color: "gray"
  }

})

export default Contacts;
