import "expo-dev-client";
import { useState, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./config/firebase";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./stores/mainReducer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { loginSuccess } from "./stores/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import AuthenticatedUserContext from "./helper/AuthenticatedUserContext";
import Chat from "./screens/chats/Chat";
import ChatList from "./screens/chats/Chatlist";
import Contacts from "./screens/chats/Contacts";
import GroupChat from "./screens/chats/GroupChat";
import Groups from "./screens/chats/Group";
import HeaderChat from "./components/chats/HeaderChat";
import CreateGroupChat from "./screens/chats/CreateGroupChat";
import Profile from "./screens/chats/Profile";
import Toast from "react-native-toast-message";
import toastConfig from "./config/toastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailProfile from "./screens/chats/ProfileDetail";
import VideoChat from "./screens/chats/VideoChat";
import Home from "./screens/homepage/Home";
import MyStack from "./components/forums/Stacks";
import RequestJoin from "./screens/chats/RequestJoin";
// LogBox.ignoreAllLogs();
import LoginView from "./screens/login/Login";
import SignUpView from "./screens/login/Signup";
import GrammarCheckScreen from "./screens/chats/GrammarCheck";
import Article from "./screens/homepage/Article";

const BottomTab = createBottomTabNavigator();

const Stack = createStackNavigator();

const TopTab = createMaterialTopTabNavigator();

function ChatBottomTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomTab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0097b2",
          },
          tabBarLabelStyle: {
            color: "white",
          },
        }}
      >
        <BottomTab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: () => {
              return (
                <Ionicons name="ios-home-outline" size={24} color="white" />
              );
            },
          }}
        />
        <BottomTab.Screen
          name="Chats"
          options={{
            tabBarLabel: "Chats",
            tabBarIcon: () => (
              <Ionicons
                name="ios-chatbubbles-outline"
                size={24}
                color="white"
              />
            ),
          }}
          children={() => (
            <>
              <HeaderChat />
              <TopTab.Navigator>
                <TopTab.Screen
                  name="Chat Lists"
                  component={ChatList}
                  options={{}}
                />
                <TopTab.Screen name="Find Contacts" component={Contacts} />
                <TopTab.Screen name="Find Groups" component={Groups} />
              </TopTab.Navigator>
            </>
          )}
        />
        <BottomTab.Screen
          name="Forum"
          component={MyStack}
          options={{
            tabBarIcon: () => (
              <Ionicons name="ios-compass-outline" size={24} color="white" />
            ),
          }}
        />
        <BottomTab.Screen
          name="Grammar Check Screen"
          component={GrammarCheckScreen}
          options={{
            tabBarIcon: () => (
              <FontAwesome name="language" size={24} color="white" />
            ),
            title: "Grammar",
          }}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}

function ChatStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen
          name="ChatList"
          component={ChatBottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Group Chat" component={GroupChat} />
        <Stack.Screen name="Article" component={Article} />
        <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
        <Stack.Screen name="RequestJoin" component={RequestJoin} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="DetailProf"
          component={DetailProfile}
          options={{
            title: "Contact Info",
          }}
        />
        <Stack.Screen
          name="Video Chat"
          component={VideoChat}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Signup" component={SignUpView} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {

  const { user, setUser } = useContext(AuthenticatedUserContext);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const userId = useSelector((state) => state.authReducer.userId);
  
  const dispatch = useDispatch();
  
  useEffect(() => {

    /* 
      This hook checks the whether the user has already logged in before based on the async storage,
      If they're logged in then the async storage data will be saved to redux
    */
    const checkAsyncStorage = async () => {
      const userData = await AsyncStorage.multiGet([
        "userid",
        "email",
        "username",
        "profileimageurl",
        "nativelanguage",
        "targetlanguage",
        "role",
        "devicetoken"
      ]);
      dispatch(
        loginSuccess({
          userId: userData[0][1],
          email: userData[1][1],
          username: userData[2][1],
          profileImageUrl: userData[3][1] || "",
          nativeLanguage: userData[4][1],
          targetLanguage: JSON.parse(userData[5][1]),
          role: userData[6][1],
          deviceToken: userData[7][1]
        })
      );
      
      // Change the state based on whether the user is logged in or not
      const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      });

      return unsubscribeAuth;
    };

    checkAsyncStorage();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* If the user is logged in, they will automatically be redirected to Chat Stack */}
      {userId ? (
        <Stack.Navigator>
          <Stack.Screen
            name="ChatStack"
            component={ChatStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {

  // Triggers the request user permission for cloud messaging for iOS, Android doesn't require permission
  let authStatus;
  async function requestUserPermission() {
    authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      // Get the firebase cloud messaging token for the device
      messaging().getToken().then(token => {
        // console.log(token, "<<<<< this is the firebase cloud messaging token for your device");
      })
    } else {
      console.log("failed token status", authStatus);
    }

    // Check whether initial notification is available
    messaging().getInitialNotification().then(async (remoteMessage) => {
      if (remoteMessage) {
        // console.log(remoteMessage.notification, "Notification caused app to open from quit state");
      }
    })

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(remoteMessage, 'Message handled in the background!');
    });

    // Handle notification on the foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // showToast("info", remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, [])

  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
        <Toast config={toastConfig} visibilityTime={3000}/>
      </AuthenticatedUserProvider>
    </Provider>
  );
}
