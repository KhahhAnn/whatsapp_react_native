import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import socket from "../Socket/socketConnect";
import { MYIP } from "../../constants/Utils";
import Search from "./Search";
import Header from "./Header";

export default function Chat() {
  const ipv4 = MYIP.Myip;
  const [userData, setUserData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy thông tin người dùng từ AsyncStorage
  const getUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userStore");
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
      return null;
    }
  };

  // Kết nối socket nếu chưa kết nối
  const connectSocket = (userId) => {
    if (!socket.connected) {
      socket.auth = { userId };
      console.log("Connecting socket with userId:", userId);
      socket.connect();
    }
  };

  // Lấy danh sách liên hệ từ API
  const fetchContacts = async (userId, accessToken) => {
    const endpoint = `${ipv4}/api/contact/contacts-user/${userId}`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error:", response.status, errorText);
        throw new Error("Error fetching contacts");
      }

      const data = await response.json();
      setContactData(data);
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để tải dữ liệu ban đầu
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const user = await getUserData();

      if (user) {
        setUserData(user);
        connectSocket(user.user.userId);
        await fetchContacts(user.user.userId, user.accessToken);
      } else {
        console.log("No user data found");
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Thành phần hiển thị một mục liên hệ
  const Item = ({ name, image, message, time, item }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate("ChatRoom", { item })}
    >
      <View style={styles.userCtn}>
        <Image
          style={styles.image}
          source={{ uri: image }}
          borderRadius={50}
          resizeMode="cover"
        />
        <View style={styles.msgCtn}>
          <View style={styles.userDetail}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Text style={styles.message}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#95FC7B" style={styles.loader} />
      ) : (
        <View contentInsetAdjustmentBehavior="automatic">
          <Header />
          <View style={styles.chatCtn}>
            <FlatList
              data={contactData}
              renderItem={({ item }) => (
                <Item
                  name={item.nickname}
                  message={item.lastMessage || "No message"}
                  image={item.avatar}
                  time={item.lastActive || ""}
                  item={item}
                />
              )}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={<Search />}
              ListEmptyComponent={<Text style={styles.emptyText}>No contacts found</Text>}
            />
          </View>
        </View>
      )}

      <View style={styles.newUpdate}>
        <View style={styles.pen}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../assets/images/ai.png")}
          />
        </View>
        <View style={styles.msg}>
          <MaterialCommunityIcons
            name="message-plus"
            size={28}
            color="#011513"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#011513",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatCtn: {
    marginTop: 20,
  },
  userCtn: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginBottom: 25,
  },
  msgCtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  userDetail: {
    gap: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  message: {
    fontSize: 13,
    color: "#cbd5c0",
  },
  image: {
    width: 55,
    height: 55,
  },
  newUpdate: {
    position: "absolute",
    bottom: 20,
    right: 20,
    gap: 20,
    alignItems: "center",
  },
  pen: {
    borderRadius: 10,
    backgroundColor: "#233040",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  msg: {
    borderRadius: 15,
    backgroundColor: "rgb(95, 252, 123)",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#cbd5c0",
    marginTop: 20,
  },
});
