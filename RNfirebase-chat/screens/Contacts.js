import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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
        .filter(user => user.email !== currentUserEmail);
      setContacts(usersData);
    }


    fetchContacts();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={async () => {
              navigation.navigate('Chat', { recipientEmail: item.email, recipientName : item.username, senderEmail : user.email });
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.username}</Text>
            <Text style={{ fontSize: 16 }}>{item.email}</Text>
          </TouchableOpacity>
          )
        }
        }
      />
      
    </View>
  );
}

export default Contacts;
