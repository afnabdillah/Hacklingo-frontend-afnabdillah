import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import logo from "../../assets/HACKLINGO.png"

export default function Post() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const onHandleCreate = () => {
    // Replace this function with your own functionality to post the data to your backend server
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Image Url:', imageUrl);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="Enter post title"
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDescription}
          value={description}
          placeholder="Enter post description"
        />

        <Text style={styles.label}>Image Url:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setImageUrl}
          value={imageUrl}
          placeholder="Enter image url"
        />

        <TouchableOpacity style={styles.button} onPress={onHandleCreate}>
          <Text style={styles.buttonText}>Create Post</Text>
        </TouchableOpacity>
        <Image source={logo} style={{ height: 320, width: "100%", opacity: 0.3, position: "relative", marginTop: 10 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});