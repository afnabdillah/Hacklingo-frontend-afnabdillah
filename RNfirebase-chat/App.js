import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import AuthenticatedUserContext from './helper/AuthenticatedUserContext';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Chat from './screens/Chat';
import ChatList from './screens/Chatlist';
import Contacts from './screens/Contacts';
import CreateGroupChat from './screens/CreateGroupChat'; // Import the CreateGroupChat component
import GroupChat from './screens/GroupChat';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function ChatTopTabNavigator() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Chat History" component={ChatList} />
      <TopTab.Screen name="Contacts" component={Contacts} />
    </TopTab.Navigator>
  );
}
function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatTopTabNavigator} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Group Chat" component={GroupChat} />
      <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
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

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
