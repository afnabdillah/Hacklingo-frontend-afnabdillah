import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';

function Groups({ navigation }) {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = () => {
          const groupChatsRef = collection(database, 'groupChats');
      
          const unsubscribe = onSnapshot(groupChatsRef, (querySnapshot) => {
            const groupsData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setGroups(groupsData);
          });
      
          return () => {
            unsubscribe();
          };
        };
      
        fetchGroups();
      }, []);
    const navigateToCreateGroupChat = () => {
        navigation.navigate('CreateGroupChat');
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={groups}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={{
                                padding: 15,
                                borderBottomColor: '#ccc',
                                borderBottomWidth: 1,
                            }}
                            onPress={() => {
                                navigation.navigate('Group Chat', { groupId: item.id, groupName: item.groupName });
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.groupName}</Text>
                            <Text style={{ fontSize: 14, color: '#777' }}>{item.users.length} members</Text>
                        </TouchableOpacity>

                    );
                }}
            />
            <TouchableOpacity
                style={styles.createGroupButton}
                onPress={navigateToCreateGroupChat}
            >
                <Text style={styles.createGroupButtonText}>Create Group Chat</Text>
            </TouchableOpacity>
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
});
export default Groups;
