import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { Image, View } from 'react-native';
import logo from "../assets/LOGO.png"

export default function HeaderForum() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  return (
    <View style={{ flexDirection: "row", backgroundColor: "white" }}>
      <Searchbar
        placeholder="Search"
        style={{ backgroundColor: "#F6F1F1", width: 300, marginRight: 10, height: 50 }}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Image source={logo} style={{ width: 50, height: 50, marginRight: 10 }} />
    </View>
  )
}