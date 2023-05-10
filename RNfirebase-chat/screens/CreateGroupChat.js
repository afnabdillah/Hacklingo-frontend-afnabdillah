import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Switch,
    Alert
} from 'react-native';
import { database, auth } from '../config/firebase';
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
function CreateGroupChat({ route, navigation }) {
    const { groupId, groupName: initialGroupName, groupLanguage: initialGroupLanguage, groupMembers, editMode } = route.params || {};
    const [groupName, setGroupName] = useState(initialGroupName || '');
    const [users, setUsers] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [isProGroup, setIsProGroup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(new Set(groupMembers || []));
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const languages = ['English', 'German', 'Japanese', 'French', 'Indonesian', 'Deutch', 'Spanish'];
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

    const onCreateGroupChat = async () => {
        const groupData = {
            groupName,
            users: Array.from(selectedUsers),
            languages: selectedLanguage,
            createdAt: new Date(),
            messages: [],
            admin: userEmail,
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
            <View style={styles.languageSelectorContainer}>
                <SelectDropdown
                    data={languages}
                    defaultButtonText={"Select Language"}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    renderDropdownIcon={(isOpened) => {
                        return (
                            <FontAwesome
                                name={isOpened ? "chevron-up" : "chevron-down"}
                                color={"#f8f8ff"}
                                size={18}
                            />
                        );
                    }}
                    dropdownIconPosition={"right"}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    onSelect={(item) => setSelectedLanguage(item)}
                />
            </View>
            {/* <View style={styles.proGroupRow}>
                <Text style={styles.proGroupText}>Pro Group</Text>
                <Switch
                    value={isProGroup}
                    onValueChange={setIsProGroup}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isProGroup ? '#f5dd4b' : '#f4f3f4'}
                />
            </View> */}
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
    proGroupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    proGroupText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    dropdown1BtnStyle: {
        width: "80%",
        height: 45,
        backgroundColor: "white",
        borderRadius: 30,
        // borderWidth: 1,
        borderColor: "#444",
      },
      dropdown1BtnTxtStyle: { color: "#444", right: 30, fontSize: 13 },
      dropdown1RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
      },
      dropdown1DropdownStyle: {
        backgroundColor: "#EFEFEF",
        borderRadius: 30,
        width: 250,
      },
      dropdown1RowTxtStyle: { color: "#444", alignSelf: "center" },
});

export default CreateGroupChat;

