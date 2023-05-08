import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import {
  fetchUserDetails,
  fetchUsersByNativeLanguage,
  userLogin,
  updateUserDetails,
  deleteUser,
} from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchForumDetails, fetchAllForums } from "../stores/forumsSlice";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer.users);
  const userDetails = useSelector((state) => state.usersReducer.userDetails);
  const forumDetails = useSelector((state) => state.forumsReducer.forumDetails);
  const forums = useSelector((state) => state.forumsReducer.forums);

  // console.log(forumDetails, "<<<< ini forum details");
  console.log(forums, "<<<< ini forum details");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      dispatch(userLogin({ email, password }))
        .unwrap()
        .catch((err) => {
          setErrMessage(err.message);
        });
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("userid").then((userId) => {
      // List to do: if userId exists directly navigate into chat screen
    }
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
      <Button
        onPress={() => navigation.navigate("Signup")}
        title="Go to Signup"
      />
      {/* <Button
        onPress={() => {
          dispatch(fetchUsersByNativeLanguage("Indonesian/Bahasa Indonesia"));
        }}
        title='fetch users by "Indonesia"'
      />
      <Button
        onPress={() => {
          dispatch(fetchUserDetails());
        }}
        title="fetch current user details"
      />
      <Button
        onPress={() => {
          dispatch(deleteUser());
        }}
        title="delete current user"
      />
      <Button
        onPress={() => {
          dispatch(fetchForumDetails("64582c32ee5092be8f155f5f")); // English forum id
        }}
        title="fetch forum 'english' details"
      />
      <Button
        onPress={() => {
          dispatch(fetchAllForums()); // English forum id
        }}
        title="fetch all forums"
      />
      <Button
        onPress={() => {
          const update = {
            username: "test edit via hp 2",
          };
          dispatch(updateUserDetails(update))
            .unwrap()
            .then((response) =>
              console.log(
                `Update success for id ${response.userId} with new username ${response.username}`
              )
            ).catch(err => console.log(err.message));
        }}
        title="update username 'test edit via hp'"
      />
      {errMessage && <Text>{errMessage}</Text>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#444",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
});
