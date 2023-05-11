import { View, Text, Image } from "react-native";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          marginLeft: 10,
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={{ height: 30, width: 30, borderRadius: 100 }}
        />
        <Text
          style={{
            color: "grey",
            fontSize: 12,
            marginLeft: 10,
            fontWeight: "500",
          }}
        >
          {comment.userId} • 5h ago
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 50,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 12, marginLeft: 5, fontWeight: "400" }}>
          {comment.content}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
