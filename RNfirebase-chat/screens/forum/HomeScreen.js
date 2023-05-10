import React, {useEffect} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardForum from "../../components/forum/card";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchForumDetails } from "../../stores/forumsSlice";
import showToast from "../../helper/showToast";


export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const forumName = route.name;
  const forumId = route.params.forumId;
  const dispatch = useDispatch();
  const forumDetails = useSelector(state => state.forumsReducer.forumDetails);

  useEffect(() => {
    dispatch(fetchForumDetails(forumId))
    .unwrap()
    .catch(err => showToast("error", "fetch data error", err.message));
  }, [])

  return (
    <>
      <View style={{ backgroundColor: "white", paddingBottom: 20 }}>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 40, fontWeight: "500", marginBottom: 5 }}>
            {forumName}
          </Text>
          <Text style={{ color: "grey", fontWeight: "300", fontSize: 15 }}>
            this is the detail
          </Text>
          <View
            style={{
              borderColor: "#004aad",
              borderWidth: 2,
              width: 70,
              borderRadius: 20,
              marginTop: 20,
            }}
          >
            <Text style={{ margin: 10, color: "#004aad" }}> Forum </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#F6F1F1", paddingTop: 20 }}>
        {forumDetails.posts.map(post => {
          return (
            <CardForum key={post._id} navigation={navigation} post={post}/>
          )
        })}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: "#1E90FF",
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
        onPress={() => navigation.navigate("AddPost")}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {"Post"}
        </Text>
      </TouchableOpacity>
    </>
  );
}
