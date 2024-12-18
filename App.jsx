import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyTabs from "./components/Tabs";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { StatusBar } from "expo-status-bar";
import CallVideo from "./components/Call/CallVideo";
import CallVoice from "./components/Call/CallVoice";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userStore");
        setIsLoggedIn(!!userData); // Nếu `userData` tồn tại, nghĩa là người dùng đã đăng nhập
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false); // Dừng hiển thị trạng thái loading
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="main" component={MyTabs} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="CallVoice" component={CallVoice} />
        <Stack.Screen name="CallVideo" component={CallVideo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
