import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { insertNewPost } from '../../stores/postsSlice';

export default function Post() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const dispatch = useDispatch();

  const onHandleCreate = async () => {
    try {
      const resultAction = await dispatch(
        insertNewPost({ title, description, imageUrl })
      );
      unwrapResult(resultAction);
      setTitle('');
      setDescription('');
      setImageUrl('');
      console.log('Post created successfully');
    } catch (err) {
      console.error('Failed to create post:', err);
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
    </View>
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