import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../screen/forum/HomeScreen';
import { FontAwesome } from '@expo/vector-icons';
import HeaderForum from './components/Header';
const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} options={{
          drawerStyle: {
            backgroundColor: "white",
          },
          drawerIcon: () => {
            return <FontAwesome name="comments-o" size={24} color="black" />
          },
          drawerLabelStyle: {
            color: "black"
          },
          headerStyle: {
            backgroundColor: "white"
          },
          headerTitleStyle: {
            color: "black"
          },
          headerRight: () => {
            return (
              <HeaderForum />
            )
          },
          drawerType: "front",
        }} />
      </Drawer.Navigator>
  );
}
