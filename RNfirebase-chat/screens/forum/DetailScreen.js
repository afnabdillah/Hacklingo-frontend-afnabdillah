import React, { useState } from "react";
import { Text, View, ScrollView, Image, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { insertNewComment } from "../../stores/commentsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailScreen({ navigation }) {
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();

  const handleAddComment = async () => {
    try {
      const input = { comment: commentText };
      await dispatch(insertNewComment(input)).unwrap();
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ backgroundColor: "white", justifyContent: "space-between", width: "100%", height: "100%" }}>
          <View style={{ marginLeft: 20, padding: 5, flexDirection: "row" }}>
            <Image source={{ uri: "https://i.pravatar.cc/300" }} style={{ height: 40, width: 40, borderRadius: 100 }} />
            <View>
              <Text style={{ marginLeft: 20 }}>Hallo</Text>
              <Text style={{ marginLeft: 20, color: "grey" }}>12 - 12 - 2012</Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: "500" }}>
              DISINI NAMA POST NYA
            </Text>
          </View>
          <View style={{ marginTop: 10, width: "100%", height: 200 }}>
            <Image source={{ uri: "https://thumb.viva.co.id/media/frontend/thumbs3/2019/11/21/5dd64a2d921ea-5-makanan-penyebab-stroke-yang-jarang-diketahui_665_374.jpg" }} style={{ height: "100%", width: "100%" }} />
          </View>
          <View style={{ justifyContent: "flex-start" }}>
            <View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 10, borderBottomWidth: 5, borderColor: "#F6F1F1", justifyContent: "flex-end", flex:1 }}>
              <Ionicons name="ios-chatbox-outline" size={20} color="black" style={{ marginLeft: 20 }} />
              <Text style={{ fontSize: 12, color: "grey", marginLeft: 5 }}> 1000 </Text>
            </View>
            {/* comment di forum */}
            <View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 10 }}>
              <Image source={{ uri: "https://i.pravatar.cc/300" }} style={{ height: 30, width: 30, borderRadius: 100 }} />
              <Text style={{ color: "grey", fontSize: 12, marginLeft: 10, fontWeight: "500" }}>nama • 5h ago</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 50, paddingBottom: 10 }}>
              <Text style={{ fontSize: 12, marginLeft: 5, fontWeight: "400" }}>
                The dude said he "unknowingly hit a girl" {"\n"}
                HE CHOOSE TO FUCKING SHOOT AT CHILDREN!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 20 }}>
        <TextInput
          style={{
            backgroundColor: 'white',
            borderRadius: 25,
            paddingHorizontal: 20,
            paddingVertical: 10,
            flex: 1,
            marginRight: 10,
          }}
          placeholder="Add Comment"
          onChangeText={text => setCommentText(text)}
          value={commentText}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#0097b2',
            borderRadius: 25,
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleAddComment}
        >
          <Ionicons name="ios-paper-plane-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}