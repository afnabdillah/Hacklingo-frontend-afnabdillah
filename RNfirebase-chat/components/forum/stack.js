import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from '../../screens/forum/DetailScreen';
import DrawerNav from './drawers';
import { FontAwesome } from '@expo/vector-icons';
import HeaderPost from './HeaderPost';
import Post from '../../screens/forum/Post';
import Comments from '../../screens/forum/Comment';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator option={{}}>
      <Stack.Screen name="Forum" component={DrawerNav} options={{headerShown: false}}/>
      <Stack.Screen name="Post" component={DetailScreen} options={{
        headerRight: () => {
          return <HeaderPost />
        },
        headerTitle: () => { return <FontAwesome name="comments-o" size={30} color="black" /> },
        headerStyle: {
          backgroundColor: "#0097b2"
        },
      }} />
      <Stack.Screen name='AddPost' component={Post} options={{
        headerRight: () => {
          return <HeaderPost />
        },
        headerTitle: () => { return <FontAwesome name="comments-o" size={30} color="black" /> },
        headerStyle: {
          backgroundColor: "#0097b2"
        },
      }}/>
      <Stack.Screen name='Comment' component={Comments} options={{
        headerRight: () => {
          return <HeaderPost />
        },
        headerTitle: () => { return <FontAwesome name="comments-o" size={30} color="black" /> },
        headerStyle: {
          backgroundColor: "#0097b2"
        },
      }} />
    </Stack.Navigator>
  );
}