import * as React from 'react';
import { Image, View } from 'react-native';
import logo from "../assets/LOGO.png"

export default function HeaderPost() {
  return (
    <View style={{ flexDirection: "row", backgroundColor: "white" }}>
      <Image source={logo} style={{ width: 50, height: 50, marginRight: 10 }} />
    </View>
  )
}