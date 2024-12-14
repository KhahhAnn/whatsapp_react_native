import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Cần cài đặt react-native-vector-icons
import { MYIP } from "../../constants/Utils";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialMessages = [
   { id: "1", text: "Xin chào", sender: "me" },
   { id: "2", text: "Mấy giờ chúng ta đi xem phim?", sender: "them" },
   { id: "3", text: "8 giờ tối, mình nghĩ vậy...", sender: "me" },
];

const ChatRoom = ({ navigation }) => {
   const route = useRoute();
   const { item } = route.params; 

   const [messages, setMessages] = useState(initialMessages);
   const [input, setInput] = useState("");   

   useEffect(() => {
      // Kết nối socket khi component mount
      const fetchData = async (receiverId) => {
         const data = await getUserData();
         if (data) {
            const endpoint = `https://whatsapp-server-lemon.vercel.app/api//message/messages-between/${data.user.userId}/${receiverId}`;
            try {
               const response = await fetch(endpoint, {
                  method: "GET",
                  headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.accessToken}`,
                  },
               });            
   
               console.log("response", response);
               
               if (!response.ok) {
                  const errorText = await response.text();
                  console.log("Error:", response.status, errorText);
                  throw new Error("Error fetching contacts");
               }
            } catch (error) {
               console.error("Error fetching contacts:", error.message);
            }
         }
      };

      fetchData(item.contactUserId);
   }, []);

   // const handleSend = () => {
   //    if (input.trim()) {
   //       const message = { id: Date.now().toString(), text: input.trim(), sender: "me" };
   //       socket.emit("privateMessage", { message: message.text, to: item.userId });
   //       setMessages((prevMessages) => [message, ...prevMessages]);
   //       setInput("");
   //    }
   // };

   const getUserData = async () => {
      try {
         const userData = await AsyncStorage.getItem("userStore");
         const user = JSON.parse(userData);
         return user;
         } catch (error) {
         console.error("Error retrieving user data:", error.message);
         return null;
      }
   };

   


   return (
      <View style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
         </TouchableOpacity>
         <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.nickname}</Text>
         </View>
         <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton}>
               <Icon name="call" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
               <Icon name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
         </View>
      </View>
      {/* Danh sách tin nhắn */}
      <ImageBackground source={require('../../assets/peakpx.jpg')} style={styles.container}>
         <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <View
                  style={[
                  styles.messageContainer,
                  item.sender === "me" ? styles.myMessage : styles.theirMessage,
                  ]}
               >
                  <Text style={styles.messageText}>{item.text}</Text>
               </View>
            )}
            inverted
         />
      </ImageBackground>
      {/* Hộp nhập liệu */}
      <View style={styles.inputContainer}>
         <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#aaa"
         />
         <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Gửi</Text>
         </TouchableOpacity>
      </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#e5ddd5",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      paddingTop: 50,
      backgroundColor: "#075E54", 
   },
   backButton: {
      paddingHorizontal: 10,
   },
   titleContainer: {
      flex: 1,
      marginLeft: 10,
   },
   title: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
   },
   actionButtons: {
      flexDirection: "row",
   },
   iconButton: {
      marginLeft: 15,
   },
   messageContainer: {
      maxWidth: "80%",
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
   },
   myMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#DCF8C6",
   },
   theirMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#ffffff",
   },
   messageText: {
      fontSize: 16,
      color: "#333",
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#ffffff",
      borderTopWidth: 1,
      borderColor: "#ddd",
   },
   input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 20,
      paddingHorizontal: 15,
      marginRight: 10,
   },
   sendButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#075E54",
      borderRadius: 20,
   },
   sendButtonText: {
      color: "#fff",
      fontWeight: "bold",
   },
});

export default ChatRoom;
