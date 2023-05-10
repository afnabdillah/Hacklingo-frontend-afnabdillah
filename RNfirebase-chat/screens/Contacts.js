import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AuthenticatedUserContext from "../helper/AuthenticatedUserContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByNativeLanguage, fetchUsersBySearch } from "../stores/usersSlice";
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AuthenticatedUserContext from '../helper/AuthenticatedUserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Contacts({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const { user } = useContext(AuthenticatedUserContext);
  const dispatch = useDispatch();

  const usersBySearch = useSelector(
    (state) => state.usersReducer.usersBySearch
  );
  const usersByNativeLanguage = useSelector((state) => state.usersReducer.users);
  const userId = useSelector((state) => state.authReducer.userId);
  const userEmail = useSelector((state) => state.authReducer.email);
  const userProfileImageUrl = useSelector((state) => state.authReducer.profileImageUrl);
  const username = useSelector((state) => state.authReducer.username);

  const contactsList = usersBySearch.filter((user) => user._id !== userId);

  console.log(userId, "<<<< ini userId");
  console.log(userEmail, "<<<< ini userEmail");
  console.log(userProfileImageUrl, "<<<< ini userProfileImage");
  console.log(username, "<<<< ini username");

  useEffect(() => {
    dispatch(fetchUsersByNativeLanguage("Indonesian/Bahasa Indonesia"));
    dispatch(fetchUsersBySearch(""));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <FlatList
        data={contactsList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={async () => {
                navigation.navigate("Chat", {
                  recipientEmail: item.email,
                  recipientName: item.username,
                  senderEmail: userEmail,
                });
              }}
            >
              <Image
                source={{
                  uri: item.profileImageUrl || "https://i.pravatar.cc/300",
                }}
                style={styles.image}
              />
              <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>
                  {item.username}
                </Text>
                <Text numberOfLines={2} style={styles.subTitle}>
                  {item.email}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 20,
    fontStyle: "italic",
  },

  content: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
    paddingBottom: 5,
  },

  subTitle: {
    color: "gray",
    fontStyle: "italic",
  },
});

export default Contacts;
