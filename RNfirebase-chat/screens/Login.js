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
import {
  deletePostById,
  fetchPostDetails,
  fetchPostsBySearch,
  insertNewPost,
  updatePostById,
} from "../stores/postsSlice";
import {
  deleteCommentById,
  fetchCommentDetails,
  insertNewComment,
  updateCommentById,
} from "../stores/commentsSlice";
import { fetchArticleById, fetchArticles } from "../stores/articlesSlices";
import pickImage from "../helper/imagePicker";
import axios from "axios";
import pickAudio from "../helper/audioPicker";
import showToast from "../helper/showToast";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersReducer.users);
  const userDetails = useSelector((state) => state.usersReducer.userDetails);
  const forumDetails = useSelector((state) => state.forumsReducer.forumDetails);
  const postDetails = useSelector((state) => state.postsReducer.postDetails);
  const articleDetails = useSelector(
    (state) => state.articlesReducer.articleDetails
  );
  const commentDetails = useSelector(
    (state) => state.commentsReducer.commentDetails
  );
  const posts = useSelector((state) => state.postsReducer.posts);
  const forums = useSelector((state) => state.forumsReducer.forums);
  const articles = useSelector((state) => state.articlesReducer.articles);
  const updateUserStatus = useSelector(
    (state) => state.usersReducer.status.updateUserDetails
  );
  const signUpStatus = useSelector(
    (state) => state.usersReducer.status.userSignUp
  );
  const loginStatus = useSelector(
    (state) => state.usersReducer.status.userLogin
  );

  // console.log(updateUserStatus, "<<< ini status update user profile");
  // console.log(signUpStatus, "<<< ini status sign up");
  console.log(loginStatus, "<<< ini status login");
  // console.log(postDetails, "<<<< ini post details");
  // console.log(commentDetails, "<<<< ini comment details");
  // console.log(posts, "<<<< ini posts");
  // console.log(users, "<<< ini users");
  // console.log(userDetails, "<<< ini user details");
  // console.log(forumDetails, "<<<< ini forum details");
  // console.log(forums, "<<<< ini forum details");
  // console.log(articles, "<<<< ini articles");
  // console.log(articleDetails, "<<<< ini article details");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      dispatch(userLogin({ email, password }))
        .unwrap()
        .then(() => {
          // Navigate to Home after successful login
          navigation.navigate("ChatStack");
        })
        .catch((err) => {
          setErrMessage(err.message);
        });
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("username").then((username) => {
      console.log(username, "<<<< ini username di async storage");
    });
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
      {loginStatus === "error" && showToast("error", "Login error", errMessage)}
      {/* {loginStatus === "loading" && showToast("info", "Please wait a few seconds", "logging you in ...")} */}
      <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
      <Button
        onPress={() => navigation.navigate("Signup")}
        title="Go to Signup"
      />
      <Button onPress={showToast} title="show toast" />
      <Button
        onPress={() => {
          dispatch(fetchCommentDetails("64582e05ee5092be8f155fbb"))
            .unwrap()
            .catch((err) => console.log(err));
        }}
        title="fetch comment details"
      />
      <Button
        onPress={() => {
          const input = {
            content: "balesan 100 juta rupiah",
            postId: "64582c67ee5092be8f155f68",
          };
          dispatch(insertNewComment(input))
            .unwrap()
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        }}
        title="post new comment"
      />
      <Button
        onPress={() => {
          const input = {
            content: "balesan edit edit 100 juta rupiah",
          };
          dispatch(
            updateCommentById({ input, commentId: "6458aa1d08d061b54ba06cc5" })
          )
            .unwrap()
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        }}
        title="update comment"
      />
      <Button
        onPress={() => {
          dispatch(deleteCommentById("6458aa1d08d061b54ba06cc5"))
            .unwrap()
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        }}
        title="delete comment"
      />
      <Button
        onPress={() => {
          dispatch(fetchArticles("German"))
            .unwrap()
            .catch((err) => console.log(err));
        }}
        title="fetch articles with title 'german'"
      />
      <Button
        onPress={() => {
          console.log("masuk sini");
          dispatch(fetchArticleById("6458b19a08d061b54ba06d49"))
            .unwrap()
            .catch((err) => console.log(err));
        }}
        title="fetch article details"
      />
      <Button
        onPress={async () => {
          try {
            const input = {
              username: "test edit username via image",
            };
            const imageData = await pickImage();
            const formData = new FormData();
            formData.append("file", imageData);
            formData.append("username", input.username);
            const result = await dispatch(updateUserDetails(formData)).unwrap();
          } catch (err) {
            console.log(err);
          }
        }}
        title="edit image user profile"
      />
      <Button
        onPress={() => {
          const input = {
            username: "test edit username via audio",
          };
          pickAudio().then((audioData) => {
            const formData = new FormData();
            formData.append("file", audioData);
            formData.append("username", input.username);
            return dispatch(updateUserDetails(formData));
          });
        }}
        title="upload audio"
      />
      <Button
        onPress={() => {
          axios({
            method: "GET",
            url: "https://ad2b-103-171-163-143.ngrok-free.app",
          })
            .then((response) => console.log(response.data))
            .catch((err) => console.error(err));
          // .unwrap()
          // .catch((err) => console.log(err, "<<<< ini error di login"));
        }}
        title="try connect"
      />
      {/* <Button
        onPress={() => {
          dispatch(fetchUsersByNativeLanguage("Indonesian/Bahasa Indonesia"))
          .unwrap()
          .catch(err => console.log(err));
        }}
        title='fetch users by "Indonesia"'
      />
      <Button
        onPress={() => {
          dispatch(fetchUserDetails())
          .unwrap()
          .catch(err => console.log(err))
        }}
        title="fetch current user details"
      />
      <Button
        onPress={() => {
          dispatch(deleteUser())
          .unwrap()
          .then(data => console.log(data, "<<< delete user success"))
          .catch(err => console.log(err));
        }}
        title="delete current user (jangan nakal ya)"
      />
      <Button
        onPress={() => {
          dispatch(fetchPostsBySearch("test"))
          .unwrap()
          .catch(err => console.log(err));
        }}
        title="fetch posts containing 'test' in title"
      />
      <Button
        onPress={() => {
          const input = {
            content : "halo dari hp edit content"
          }
          dispatch(updatePostById({input, postId : "64582bafee5092be8f155f5b"}))
          .unwrap()
          .then(data => console.log(`post id 64582bafee5092be8f155f5b successfully updated!`))
          .catch(err => console.log(err));
        }}
        title="update first post content in db"
      />
      <Button
        onPress={() => {
          dispatch(deletePostById("64582db7ee5092be8f155f9f"))
          .unwrap()
          .catch(err => console.log(err));
        }}
        title="delete last post in db"
      />
      <Button
        onPress={() => {
          const input = {
            title : "halo dari hp",
            content : "halo dari hp",
            forumId : "64582c32ee5092be8f155f5f"
          }
          dispatch(insertNewPost(input))
          .unwrap()
          .then(data => console.log(data, "<<< ini post baru"))
          .catch(err => console.log(err, "<<< ini error validation"));
        }}
        title="insert post 'halo dari hp'"
      />
      <Button
        onPress={() => {
          dispatch(fetchForumDetails("64582c32ee5092be8f155f5f")) // English forum id
          .unwrap()
          .catch(err => console.log(err));
        }}
        title="fetch forum 'english' details"
      />
      <Button
        onPress={() => {
          dispatch(fetchAllForums()) // English forum id
          .unwrap()
          .catch(err => console.log(err));
        }}
        title="fetch all forums"
      />
      <Button
        onPress={() => {
          console.log("masuk button fetch posts");
          dispatch(fetchPostDetails("64582bafee5092be8f155f5b")) // Post pertama
          .unwrap()
          .catch(err => console.log(err));
        }}
        title="fetch post details"
      />
      <Button
        onPress={() => {
          const update = {
            username: "test edit via hp 4",
          };
          dispatch(updateUserDetails(update))
            .unwrap()
            .then((response) =>
              console.log(
                `Update success for id ${response._id} with new username ${response.username}`
              )
            )
            .catch((err) => console.log(err));
        }}
        title="update username 'test edit via hp'"
      /> */}
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
