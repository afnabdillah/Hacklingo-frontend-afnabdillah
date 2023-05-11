import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

// ...
const webViews = ({route}) => {
  const {imageUrl} = route.params
  return <WebView source={{ uri: imageUrl }} style={{ flex: 1 }} />;
}

export default webViews