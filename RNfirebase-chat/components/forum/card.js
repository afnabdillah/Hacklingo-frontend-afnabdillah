import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const CardForum = ({ navigation, post }) => {
  console.log(post.title, "<<< ini post title");

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Post", { post });
      }}
    >
      <Card
        style={{ backgroundColor: "white", marginLeft: 20, marginRight: 20 }}
      >
        <Card.Content>
          <Text variant="titleLarge">{post.title}</Text>
          <Text variant="bodyMedium">{post.content}</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Button style={{}}>
              <FontAwesome name="comments-o" size={24} color="black" />
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CardForum;
