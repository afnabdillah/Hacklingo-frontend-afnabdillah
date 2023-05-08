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
      console.log(usersData, "<<< ini data users")
      setContacts(usersData);
    }


    fetchContacts();
  }, []);
<<<<<<< HEAD
  console.log(contacts, "<<< contacts")
=======
>>>>>>> 9665be8872cd83f36f4042ee05fdbf7706b0b185
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 10 }}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          console.log(item, "contac<<<<<");
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={async () => {
                const recipientName = await getUsernameByEmail(item.id);
                navigation.navigate('Chat', { recipientEmail: item.email, recipientName: item.username, senderEmail: user.email });
              }}
            >
              <Image source={{ uri: 'https://i.pravatar.cc/300' }}
                style={styles.image}
              />
              <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>{item.username}</Text>
                <Text numberOfLines={2} style={styles.subTitle}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )
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
    fontSize: 20,
    fontStyle: 'italic'
  },

  content: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
    paddingBottom: 5
  },

  subTitle: {
    color: "gray",
    fontStyle: 'italic'
  }

})

export default Contacts;
