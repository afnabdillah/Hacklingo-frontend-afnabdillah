import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../screens/forum/HomeScreen";
import { FontAwesome } from "@expo/vector-icons";
import HeaderForum from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllForums } from "../../stores/forumsSlice";
import { View, ActivityIndicator } from "react-native";
const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  const dispatch = useDispatch();
  const forums = useSelector((state) => state.forumsReducer.forums);

  useEffect(() => {
    dispatch(fetchAllForums());
  }, []);

  if (!forums || forums.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Drawer.Navigator>
      {forums.map((el) => {
        return (
          <Drawer.Screen
            key={el._id}
            name={el.name}
            component={HomeScreen}
            initialParams={{ forumId: el._id }}
            options={{
              drawerStyle: {
                backgroundColor: "white",
              },
              drawerIcon: () => {
                return (
                  <FontAwesome name="comments-o" size={24} color="black" />
                );
              },
              drawerLabelStyle: {
                color: "black",
              },
              headerStyle: {
                backgroundColor: "white",
              },
              headerTitleStyle: {
                color: "black",
              },
              headerRight: () => {
                return <HeaderForum />;
              },
              headerTitle: () => <></>,
              drawerType: "front",
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
}
