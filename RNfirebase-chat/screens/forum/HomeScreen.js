import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardForum from "../../components/forum/card";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchForumDetails } from "../../stores/forumsSlice";
import showToast from "../../helper/showToast";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const forumName = route.name;
  const forumId = route.params.forumId;
  const forumDetails = useSelector((state) => state.forumsReducer.forumDetails);
  const fetchForumDetailsStatus = useSelector(
    (state) => state.forumsReducer.status.forumDetails
  );

  const dispatch = useDispatch();

  const showAllDesc = () => { };

  useEffect(() => {
    dispatch(fetchForumDetails(forumId))
      .unwrap()
      .catch((err) => showToast("error", "fetch data error", err.message));
  }, [forumId]);

  if (fetchForumDetailsStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={{ backgroundColor: "white", paddingBottom: 20 }}>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 40, fontWeight: "500", marginBottom: 5 }}>
            {forumName}
          </Text>
          <Pressable onPress={showAllDesc}>
            <Text style={{ color: "grey", fontWeight: "300", fontSize: 15 }}>
              {forumDetails.description?.split(".").slice(0, 2).join(".")}...
            </Text>
          </Pressable>
          <ScrollView horizontal={true}>
            <View
              style={{
                borderColor: "#004aad",
                borderWidth: 2,
                width: 70,
                borderRadius: 20,
                marginTop: 20,
                marginRight: 15
              }}
            >
              <Text style={{ margin: 10, color: "#004aad" }}> Forum </Text>
            </View>
            <View
              style={{
                borderColor: "#004aad",
                borderWidth: 2,
                width: 70,
                borderRadius: 20,
                marginTop: 20,
                marginRight: 15
              }}
            >
              <Text style={{ margin: 10, color: "#004aad" }}> Forum </Text>
            </View>
          </ScrollView>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#F6F1F1", paddingTop: 20 }}>
        {forumDetails.posts?.map((post) => {
          return (
            <CardForum key={post._id} navigation={navigation} post={post} />
          );
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
