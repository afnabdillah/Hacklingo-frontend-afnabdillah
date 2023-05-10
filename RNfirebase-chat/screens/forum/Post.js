import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { insertNewPost } from "../../stores/postsSlice";
import pickImage from "../../helper/imagePicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import showToast from "../../helper/showToast";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

export default function Post({ route }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageData, setSelectedImageData] = useState({});
  const insertPostStatus = useSelector(
    (state) => state.postsReducer.status.newPost
  );
  const { forumId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onPickImage = async () => {
    try {
      const imageData = await pickImage();
      setSelectedImage(imageData.uri);
      setSelectedImageData(imageData);
    } catch (err) {
      console.log(err, "<<< ini err pick image untuk post");
    }
  };

  const onCreatePost = () => {
    if (title !== "" && content !== "") {
      const form = new FormData();
      if (Object.keys(selectedImageData)[0]) {
        form.append("file", selectedImageData);
      }
      form.append("title", title);
      form.append("content", content);
      form.append("forumId", forumId);
      dispatch(insertNewPost(form))
      .unwrap()
      .then(() => {
        showToast("success", "Insert Post Success!", "you have succesfully update your post!");
        navigation.goBack();
      })
      .catch((err) => {
        showToast("error", "Insert New Post Error", err.message)
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTitle}
        value={title}
        placeholder="Enter post title"
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setContent}
        value={content}
        placeholder="Enter post content"
      />

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={onPickImage}
          style={{
            marginTop: 10,
            marginBottom: 20,
            borderRadius: 120,
            width: 120,
            height: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={"grey"}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 120 }}
            />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>

      {insertPostStatus === "loading" && (
        <View
          style={{marginTop:20, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={20} />
          <Text>Uploading your post ...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
