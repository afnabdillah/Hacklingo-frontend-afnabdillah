import { Image, ScrollView, Text, View } from "react-native";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function DetailProfile({route}) {
  const { name, email } = route.params;
  console.log(name, email);
  return (
    <>
      <ScrollView>
        <View style={{justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: 30}}>
          <Image source={{ uri: "https://i.pravatar.cc/300"}} style={{width: 120, height: 120, borderRadius: 100}}/>
          <Text style={{fontSize: 30, fontWeight: "600", marginTop: 10}}>{name}</Text>
          <Text style={{ fontSize: 20, fontWeight: "300", marginTop: 10, color: "grey" }}>{email}</Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, paddingTop: 5}}>
          <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
            <FontAwesome name="phone" size={24} color="#077eff" />
            <Text style={{fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10}}>audio</Text>
          </View>
          <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
            <FontAwesome5 name="video" size={24} color="#077eff" />
            <Text style={{ fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10 }}>video</Text>
          </View>
          <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
            <Ionicons name="search-sharp" size={24} color="#077eff" />
            <Text style={{ fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10 }}>search</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "start", flexDirection: "column", marginTop: 30, marginLeft: "5%"  }}>
          <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, padding: 10, marginBottom: 20 }}>
            <Text style={{marginLeft: 10, fontSize: 16, fontWeight: "500"}}>Hello, my name is {name}</Text>
            <Text style={{ marginLeft: 10, fontSize: 16, marginTop: 10, color: "grey" }}>17/04/23 at 20.02</Text>
          </View>
          <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, padding: 10 }}>
            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "500" }}>Hello, my name is {name}</Text>
            <Text style={{ marginLeft: 10, fontSize: 16, marginTop: 10, color: "grey" }}>17/04/23 at 20.02</Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}