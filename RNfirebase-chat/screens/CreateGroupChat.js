import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Switch,
    Alert,
    ImageBackground
} from 'react-native';
import { database, auth } from '../config/firebase';
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BG from '../assets/HACKLINGO.png'

function CreateGroupChat({ route, navigation }) {
    const { groupId, groupName: initialGroupName, groupLanguage: initialGroupLanguage, groupMembers, editMode } = route.params || {};
    const [groupName, setGroupName] = useState(initialGroupName || '');
    const [users, setUsers] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [isProGroup, setIsProGroup] = useState(false);
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
        <>
            <TouchableOpacity
                style={[
                    styles.checkBox,
                ]}
                onPress={onPress}
            >
                <Text style={{ alignSelf: 'center' }}>{isSelected ? '✔' : ''}</Text>
            </TouchableOpacity>
        </>
    );

    useEffect(() => {
        const fetchEmail = async () => {
            const email = await AsyncStorage.getItem("email");
            setUserEmail(email);
        };

        fetchEmail();
    }, []);

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
            if (!isProGroup && newSelectedUsers.size >= 5) {
                Alert.alert(
                    'Member Limit Reached',
                    'Non-Pro groups can have a maximum of 5 members. Upgrade to a Pro group to add more members.',
                    [{ text: 'OK' }]
                );
                return;
            }
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
            admin: userEmail,
            isProGroup,
            requestJoin: []
        };

        const groupChatsRef = collection(database, 'groupChats');
        console.log(`Group Chat ${groupName} created`)
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
        <ImageBackground source={BG} style={{ flex: 1, opacity: 0.7, height: '100%', }}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={setGroupName}
                />
                <View style={styles.box}>
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
                </View>
                <View style={styles.box}>
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
                </View>
                {/* <View style={styles.GroupPro}>
                    <View style={styles.proGroupRow}>
                        <Text style={styles.proGroupText}>Pro Group</Text>
                        <View style={{ flex: 1 }}>
                            <Switch
                                value={isProGroup}
                                onValueChange={setIsProGroup}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isProGroup ? '#f5dd4b' : '#f4f3f4'}
                            />
                        </View>
                    </View>
                </View> */}
                <TouchableOpacity style={styles.createButton} onPress={onCreateGroupChat}>
                    <Text style={styles.buttonText}>Create Group Chat</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    GroupPro: {
        borderWidth: 1,
        borderColor: '#0097b2',
        borderRadius: 10,
        paddingHorizontal: 16,
        marginVertical: 5,
        paddingVertical: 5
    },
    box: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#0097b2',
        padding: 16,
        borderRadius: 10,
        marginVertical: 5,
        paddingVertical: 5
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16
    },
    input: {
        borderWidth: 3,
        borderColor: '#0097b2',
        borderRadius: 10,
        paddingVertical: 5,
        marginVertical: 5,
        padding: 10
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userName: {
        marginLeft: 8,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#0097b2',
        borderBottomWidth: 1,
        textAlign: 'center'
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
        marginLeft: 8,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    createButton: {
        backgroundColor: '#0097b2',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignSelf: 'center'
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    checkBox: {
        width: 25,
        height: 25,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0097b2',
        marginRight: 5,
    },
    proGroupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    proGroupText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default CreateGroupChat;

