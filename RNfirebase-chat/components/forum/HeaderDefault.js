import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import logo from "./assets/LOGO.png"

export default function HeaderDefault() {
  const width = Dimensions.get("window").width
  return (
    <View style={{ flexDirection: "row", backgroundColor: "white", alignItems: "center" }}>
      <Image source={logo} style={{ width: 50, height: 50, marginLeft: width * 0.45, zIndex: 10 }} />
    </View>
  )
}