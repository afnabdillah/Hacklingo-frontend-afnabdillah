import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../config/firebase';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';

function Groups({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [unjoinedGroups, setUnjoinedGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = () => {
            const groupChatsRef = collection(database, "groupChats");

            const unsubscribe = onSnapshot(groupChatsRef, (querySnapshot) => {
                const groupsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const userEmail = auth.currentUser?.email;
                const joined = groupsData.filter((group) =>
                    group.users.includes(userEmail)
                );
                const unjoined = groupsData.filter(
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
    }, []);
    const navigateToCreateGroupChat = () => {
        navigation.navigate('CreateGroupChat');
    };
    const renderGroupItem = ({ item }) => {
        console.log(item, "<< group")
        return (
            <TouchableOpacity
                style={{
                    padding: 15,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                }}
                onPress={() => {
                    navigation.navigate("Group Chat", {
                        groupId: item.id,
                        groupName: item.groupName,
                    });
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.groupName}</Text>
                <Text style={{ fontSize: 14, color: "#777" }}>
                    {item.users.length} members
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                data={joinedGroups}
                keyExtractor={(item) => item.id}
                renderItem={renderGroupItem}
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
                            renderItem={renderGroupItem}
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginLeft: 15,
    },
});
export default Groups;
