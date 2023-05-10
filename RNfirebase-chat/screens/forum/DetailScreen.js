import { Text, View, ScrollView, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function DetailScreen() {
  return (
    <>
      <ScrollView>
        <View style={{backgroundColor: "white", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <View style={{marginLeft: 20, padding: 5, flexDirection: "row"}}>
            <FontAwesome name="user-circle-o" size={30} color="black" />
            <View>
              <Text style={{marginLeft: 20}}>Hallo</Text>
              <Text style={{marginLeft: 20, color: "grey"}}>12 - 12 - 2012</Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{marginLeft: 20, fontSize: 20, fontWeight: "500"}}>
              DISINI NAMA POST NYA
            </Text>
            <View style={{ marginLeft: 20, borderColor: "#f29222", borderWidth: 2, marginTop: 10, width: 55, padding: 5, borderRadius: 15}}>
              <Text style={{ fontWeight: "400" }}>Funny</Text>
            </View>
          </View>
          <View style={{marginTop: 10, width: "100%", height: "100%"}}>
            <Image source={{ uri: "https://thumb.viva.co.id/media/frontend/thumbs3/2019/11/21/5dd64a2d921ea-5-makanan-penyebab-stroke-yang-jarang-diketahui_665_374.jpg"}} style={{height: "100%", width: "100%"}}/>
            <Text>gvfd</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            
          </View>
        </View>
      </ScrollView>
    </>
  )
}