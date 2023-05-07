import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import {
  fetchUserDetails,
  fetchUsersByNativeLanguage,
  updateUserDetails,
  userLogin,
} from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer.users);

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      dispatch(userLogin({ email, password }));
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("userid").then((userId) =>
      // List to do: if userId exists directly navigate into chat screen
      console.log(userId, "<<< ini userId di useEffect")
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
      <Button
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
          const update = {
            username: "test edit via hp",
          };
          dispatch(updateUserDetails(update));
        }}
        title="update username 'test edit via hp'"
      />
      <View>
        {users.length !== 0 &&
          users.map((el) => {
            return <Text>{el.username}</Text>;
          })}
      </View>
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
