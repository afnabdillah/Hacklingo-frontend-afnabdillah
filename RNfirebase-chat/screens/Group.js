import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    collection,
    getDocs,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
} from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

function Groups({ navigation }) {
    const route = useRoute();
    const language  = route.params ? route.params.language : undefined;
    const [groups, setGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [unjoinedGroups, setUnjoinedGroups] = useState([]);
    const userEmail = useSelector((state) => state.authReducer.email);
    useEffect(() => {
        const fetchGroups = async () => {
            const groupChatsRef = collection(database, "groupChats");

            const unsubscribe = onSnapshot(groupChatsRef, (querySnapshot) => {
                const groupsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                // console.log(groupsData.languages, "<< groups data");
                // console.log(groupsData.languages, "<< groups data");

                const filteredGroups = language
                    ? groupsData.filter((group) => group.languages === language)
                    : groupsData;
                const joined = filteredGroups.filter((group) =>
                    group.users.includes(userEmail)
                );
                const unjoined = filteredGroups.filter(
                    (group) => !group.users.includes(userEmail)
                );

                setJoinedGroups(joined);
                setUnjoinedGroups(unjoined);
            });

            return () => {
                unsubscribe();
            };
        };

        fetchGroups();
    }, [language]);

    const navigateToCreateGroupChat = () => {
        navigation.navigate('CreateGroupChat');
    };

    const handleJoinRequest = async (item) => {
        const groupDocRef = doc(database, 'groupChats', item.id);
        const userEmail = await AsyncStorage.getItem('email');
        const username = await AsyncStorage.getItem('username');
        await updateDoc(groupDocRef, {
            requestJoin: arrayUnion({ email: userEmail, username: username }),
        });
    };

    const showJoinRequestAlert = (item) => {
        Alert.alert(
            'Join Group',
            `Are you sure you want to join "${item.groupName}" group?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleJoinRequest(item),
                },
            ],
            { cancelable: false }
        );
    };

    const handleGroupClick = (item, joinRequest) => {
        if (joinRequest) {
            showJoinRequestAlert(item);
        } else {
            navigation.navigate('Group Chat', {
                groupId: item.id,
                groupName: item.groupName,
            });
        }
    };

    const renderGroupItem = ({ item }, joinRequest) => {
        return (
            <TouchableOpacity
                style={{
                    padding: 15,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                }}
                onPress={() => handleGroupClick(item, joinRequest)}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.groupName}</Text>
                <Text style={{ fontSize: 14, color: '#777' }}>
                    {item.users.length} members
                </Text>
            </TouchableOpacity>
        );
    };
    return (
        <>
            {joinedGroups.length === 0 && unjoinedGroups.length === 0 ? (
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <AntDesign name="deleteusergroup" size={200} color="black" />
                    <Text style={{ textAlign: "center", marginTop: 10 }}>
                        Group with {language} language is not found, maybe you can create them first!
                    </Text>
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <FlatList
                        data={joinedGroups}
                        keyExtractor={(item) => item.id}
                        renderItem={(item) => renderGroupItem(item, false)} // Joined groups
                        ListHeaderComponent={() => (
                            <View>
                                <Text style={styles.sectionTitle}>Joined Groups</Text>
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View>
                                <Text style={styles.sectionTitle}>Unjoined Groups</Text>
                                <FlatList
                                    data={unjoinedGroups}
                                    keyExtractor={(item) => item.id}
                                    renderItem={(item) => renderGroupItem(item, true)} // Unjoined groups
                                />
                            </View>
                        )}
                    />
                    <TouchableOpacity
                        style={styles.createGroupButton}
                        onPress={navigateToCreateGroupChat}
                    >
                        <Text style={styles.createGroupButtonText}>Create Group Chat</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    chatRow: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatName: {
        fontSize: 18,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        paddingTop: 16,
    },
    createGroupButton: {
        backgroundColor: '#0097b2',
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 15,
    },
});

export default Groups;