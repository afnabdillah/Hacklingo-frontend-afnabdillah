import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Contacts({ navigation }) {
  const [contacts, setContacts] = useState([]);

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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={async () => {
              const recipientName = await getUsernameByEmail(item.id);
              navigation.navigate('Chat', { recipientEmail: item.email, recipientUsername : item.username });
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.username}</Text>
            <Text style={{ fontSize: 16 }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Contacts;
