import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({ user, groupId }) => {
    const navigatiion = useNavigation()
    const acceptRequest = async () => {
        const groupDocRef = doc(database, 'groupChats', groupId);
        await updateDoc(groupDocRef, {
            requestJoin: arrayRemove(user),
            users: arrayUnion(user.email),
        });
    };

    const denyRequest = async () => {
        const groupDocRef = doc(database, 'groupChats', groupId);
        await updateDoc(groupDocRef, {
            requestJoin: arrayRemove(user),
        });
    };

    return (
        <View style={styles.card}>
            <Text style={styles.userInfo}>{user.username}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={acceptRequest} style={styles.acceptButton}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={denyRequest} style={styles.denyButton}>
                    <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RequestJoin = ({ route }) => {
    const { groupId } = route.params;
    const [requestedUsers, setRequestedUsers] = useState([]);

    useEffect(() => {
        const fetchGroupData = async () => {
            const groupDocRef = doc(database, 'groupChats', groupId);
            const groupDoc = await getDoc(groupDocRef);
            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                const requestJoin = groupData.requestJoin || [];
                setRequestedUsers(requestJoin);
            }
        };

        fetchGroupData();
    }, [groupId, requestedUsers]);

    return (
        <View>
            {requestedUsers.map((user, index) => (
                <UserCard key={index} user={user} groupId={groupId} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 10,
    },
    userInfo: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
    },
    denyButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default RequestJoin;
