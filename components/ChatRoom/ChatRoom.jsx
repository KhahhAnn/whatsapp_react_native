import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   TextInput,
   FlatList,
   StyleSheet,
   TouchableOpacity,
   ImageBackground,
   Image,
   KeyboardAvoidingView,
   Platform,
   ActivityIndicator,
   } from "react-native";
   import Icon from "react-native-vector-icons/Ionicons"; // Cần cài đặt react-native-vector-icons
   import { MYIP } from "../../constants/Utils";
   import { io } from "socket.io-client";
   import AsyncStorage from "@react-native-async-storage/async-storage";
   import EmojiSelector from "react-native-emoji-selector";
   import socket from "../Socket/socketConnect";

   const ChatRoom = () => {
   const route = useRoute();
   const { item } = route.params;

   const [messageData, setMessageData] = useState();
   const [input, setInput] = useState("");
   const [userStore, setUserStore] = useState();
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [hasReceivedMessage, setHasReceivedMessage] = useState(false);
   const [isLoading, setIsLoading] = useState(true); // Thêm state isLoading
   const navigation = useNavigation();
   

   useEffect(() => {
      // Kết nối socket khi component mount
      const fetchData = async (receiverId) => {
         setIsLoading(true); // Bắt đầu tải dữ liệu
         const data = await getUserData();
         setUserStore(data);

         if (data) {
         const endpoint = `${MYIP.Myip}/api/message/messages-between/${data.user.userId}/${receiverId}`;

         try {
            const response = await fetch(endpoint, {
               method: "GET",
               headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${data.accessToken}`,
               },
            });

            if (!response.ok) {
               const errorText = await response.text();
               console.log("Error:", response.status, errorText);
               throw new Error("Error fetching contacts");
            } else {
               const data = await response.json();
               setMessageData(data.reverse());
            }
         } catch (error) {
            console.error("Error fetching contacts:", error.message);
         } finally {
            setIsLoading(false); // Kết thúc tải dữ liệu
         }
         }
      };

      fetchData(item.contactUserId);
   }, []);

   const sendMessage = (message, from, to) => {
      try {
         socket.emit("privateMessage", {
         message,
         from,
         to,
         });
         console.log("Send message: ", message, to);
      } catch (error) {
         console.log("error ", error);
      }
   };

   useEffect(() => {
      setTimeout(() => {
         setHasReceivedMessage(false);
      }, 1000);
   }, [hasReceivedMessage]);

   useEffect(() => {
      const handleMessage = ({ message, from }) => {
         const currentContactId = item.contactUserId;
         if (currentContactId === from) {
         setMessageData((prevMessages) => [
            { content: message, senderId: from },
            ...prevMessages,
         ]);
         }
      };

      // Lắng nghe sự kiện từ server
      socket.on("privateMessageToReceiver", handleMessage);

      // Cleanup để xóa bỏ listener khi component unmount
      return () => {
         socket.off("privateMessageToReceiver", handleMessage);
      };
   }, [item.contactUserId]);

   const handleCreateMessage = async (
      senderId,
      receiverId,
      content,
      mediaUrl
   ) => {
      const endpoint = `${MYIP.Myip}/api/message/create`;
      try {
         const response = await fetch(endpoint, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userStore.accessToken}`,
         },
         body: JSON.stringify({
            senderId,
            receiverId,
            content,
            mediaUrl,
         }),
         });

         if (!response.ok) {
         const errorText = await response.text();
         console.log("Error:", response.status, errorText);
         throw new Error("Error creating message");
         } else {
         const data = await response.json();
         setMessageData((prevMessages) => [data.messageData, ...prevMessages]);
         }
      } catch (error) {
         console.error("Error fetching contacts:", error.message);
      }
   };

   const handleSend = async () => {
      if (input.trim()) {
         sendMessage(input.trim(), userStore.user.userId, item.contactUserId);
         await handleCreateMessage(
         userStore.user.userId,
         item.contactUserId,
         input.trim()
         );
         setInput("");
         r;
      }
   };

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

   const handleEmojiSelect = (emoji) => {
      setInput((prev) => prev + emoji);
   };

   const handleImageSelect = async () => {
      const result = await launchImageLibrary({
         mediaType: "photo",
         quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
         const image = result.assets[0];
         const newMessage = {
         id: Date.now().toString(),
         content: image.uri,
         senderId: userStore.user.userId,
         receiverId: item.contactUserId,
         type: "image",
         };
         setMessageData([newMessage, ...messageData]);

         // Gửi ảnh lên server qua WebSocket hoặc API
      }
   };

   return (
      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
         <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity
               onPress={() => navigation.goBack()}
               style={styles.backButton}
            >
               <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
               <Text style={styles.title}>{item.nickname}</Text>
            </View>
            <View style={styles.actionButtons}>
               <TouchableOpacity style={styles.iconButton}  onPress={() => navigation.navigate("CallVoice", { to: item, from: userStore.user.userId, userStore: userStore })}>
                  <Icon name="call" size={24} color="#fff" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconButton}>
                  <Icon name="videocam" size={24} color="#fff" />
               </TouchableOpacity>
            </View>
         </View>

         {isLoading ? (
            <ActivityIndicator
               size="large"
               color="#95FC7B"
               style={styles.loader}
            />
         ) : (
            <ImageBackground
               source={require("../../assets/peakpx.jpg")}
               style={styles.container}
            >
               <FlatList
               data={messageData}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <View
                     style={[
                     styles.messageContainer,
                     item.senderId === userStore.user.userId
                        ? styles.myMessage
                        : styles.theirMessage,
                     ]}
                  >
                     {item.content && item.content.startsWith("data:image") ? (
                     <Image
                        source={{ uri: item.content }}
                        style={styles.messageImage}
                        resizeMode="cover"
                     />
                     ) : (
                     <Text style={styles.messageText}>{item.content}</Text>
                     )}
                  </View>
               )}
               inverted
               />
            </ImageBackground>
         )}
        {/* Emoji Selector */}
         {showEmojiPicker && (
            <EmojiSelector
               onEmojiSelected={handleEmojiSelect}
               columns={8}
               showSearchBar={false}
               showTabs={true}
            />
         )}

         {/* Input Box */}
         <View style={styles.inputContainer}>
            <TouchableOpacity
               onPress={handleImageSelect}
               style={styles.iconButton}
            >
               <Icon name="image-outline" size={24} color="#075E54" />
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setShowEmojiPicker((prev) => !prev)}
               style={styles.iconButton}
            >
               <Icon name="happy-outline" size={24} color="#075E54" />
            </TouchableOpacity>
            <TextInput
               style={styles.input}
               value={input}
               onChangeText={setInput}
               placeholder="Nhập tin nhắn..."
               placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
               <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
         </View>
         </View>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#e5ddd5",
   },
   loadingContainer: {
      // Thêm style loading container
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   messageImage: {
      width: 300,
      height: 300,
      borderRadius: 10,
      marginTop: 5,
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
      fontSize: 20,
      fontWeight: "bold",
   },
   actionButtons: {
      flexDirection: "row",
   },
   iconButton: {
      marginLeft: 10,
      padding: 5,
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#fff",
   },
   input: {
      flex: 1,
      height: 40,
      borderRadius: 20,
      paddingHorizontal: 10,
      backgroundColor: "#e5ddd5",
   },
   sendButton: {
      backgroundColor: "#075E54",
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
   },
   sendButtonText: {
      color: "#fff",
      fontWeight: "bold",
   },
   messageContainer: {
      marginVertical: 5,
      marginHorizontal: 10,
      padding: 10,
      borderRadius: 10,
      maxWidth: "80%",
   },
   myMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#d4edda",
   },
   theirMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#f8f9fa",
   },
   messageText: {
      fontSize: 16,
   },
   loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
   },
});

export default ChatRoom;
