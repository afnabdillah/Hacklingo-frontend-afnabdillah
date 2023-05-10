import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { Dimensions, Image, View } from 'react-native';
import logo from "./assets/LOGO.png"

export default function HeaderForum() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const width = Dimensions.get("window").width
  return (
    <View style={{ flexDirection: "row", backgroundColor: "#0097b2" }}>
      <Searchbar
        placeholder="Search"
        style={{ backgroundColor: "#F6F1F1", width: width * 0.7, marginRight: 10, height: 50 }}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Image source={logo} style={{ width: 50, height: 50, marginRight: 10 }} />
    </View>
  )
}