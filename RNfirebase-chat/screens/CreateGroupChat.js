import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { database, auth } from '../config/firebase';
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';

function CreateGroupChat({ route, navigation }) {
    const { groupId, groupName: initialGroupName, groupLanguage: initialGroupLanguage, groupMembers, editMode } = route.params || {};
    const [groupName, setGroupName] = useState(initialGroupName || '');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set(groupMembers || []));
    const [selectedLanguages, setSelectedLanguages] = useState(
        new Set(
            initialGroupLanguage
                ? initialGroupLanguage.includes(', ')
                    ? initialGroupLanguage.split(', ')
                    : [initialGroupLanguage]
                : []
        )
    );

    const languages = ['English', 'German', 'Japanese', 'French', 'Russian'];
    const CustomCheckBox = ({ isSelected, onPress }) => (
        <TouchableOpacity
            style={[
                styles.checkBox,
                { backgroundColor: isSelected ? '#3498db' : 'white' },
            ]}
            onPress={onPress}
        />
    );

    useEffect(() => {
        async function fetchUsers() {
            const usersCollectionRef = collection(database, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                email: doc.id,
                ...doc.data()
            }));
            setUsers(fetchedUsers);
        }

        fetchUsers();
    }, []);

    const toggleUserSelection = user => {
        const newSelectedUsers = new Set(selectedUsers);
        if (selectedUsers.has(user)) {
            newSelectedUsers.delete(user);
        } else {
            newSelectedUsers.add(user);
        }
        setSelectedUsers(newSelectedUsers);
    };

    const toggleLanguageSelection = language => {
        const newSelectedLanguages = new Set(selectedLanguages);
        if (selectedLanguages.has(language)) {
            newSelectedLanguages.delete(language);
        } else {
            newSelectedLanguages.add(language);
        }
        setSelectedLanguages(newSelectedLanguages);
    };

    const onCreateGroupChat = async () => {
        const groupData = {
            groupName,
            users: Array.from(selectedUsers),
            languages: Array.from(selectedLanguages),
            createdAt: new Date(),
            messages: [],
            admin: auth.currentUser.email
        };

        const groupChatsRef = collection(database, 'groupChats');

        if (editMode) {
            const groupDocRef = doc(database, 'groupChats', groupId);
            await setDoc(groupDocRef, groupData);
            navigation.goBack();
        } else {
            await addDoc(groupChatsRef, groupData);
        }
    };

    useEffect(() => {
        if (editMode) {
            navigation.setOptions({ title: 'Edit Group Chat' });
        }
    }, [editMode, navigation]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
            />
            <Text style={styles.sectionTitle}>Users</Text>
            <FlatList
                data={users}
                keyExtractor={item => item.email}
                renderItem={({ item }) => (
                    <View style={styles.userRow}>
                        <CustomCheckBox
                            isSelected={selectedUsers.has(item.email)}
                            onPress={() => toggleUserSelection(item.email)}
                        />
                        <Text style={styles.userName}>{item.username}</Text>
                    </View>
                )}
            />
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
                {languages.map(language => (
                    <View style={styles.languageRow} key={language}>
                        <CustomCheckBox
                            isSelected={selectedLanguages.has(language)}
                            onPress={() => toggleLanguageSelection(language)}
                        />
                        <Text style={styles.languageName}>{language}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.createButton} onPress={onCreateGroupChat}>
                <Text style={styles.buttonText}>Create Group Chat</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    userName: {
        marginLeft: 8
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8
    },
    languagesContainer: {
        marginBottom: 16
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    languageName: {
        marginLeft: 8
    },
    createButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        alignSelf: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    checkBox: {
        width: 30,
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
    },
});

export default CreateGroupChat;

