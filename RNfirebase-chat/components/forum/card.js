import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CardForum = ({ navigation }) => (
  <TouchableOpacity onPress={() => {navigation.navigate("Post")}}>
    <Card style={{ backgroundColor: "white", marginLeft: 20, marginRight: 20}}>
      <Card.Content>
        <Text variant="titleLarge">Issues</Text>
        <Text variant="bodyMedium">How i solve it ?</Text>
        <View style={{alignItems: "flex-end"}}>
          <Button style={{}} onPress={() => console.log('Pressed')}><FontAwesome name="comments-o" size={24} color="black" /></Button>
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

export default CardForum;