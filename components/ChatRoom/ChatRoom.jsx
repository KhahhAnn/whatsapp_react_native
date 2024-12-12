import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";

const messages = [
   { id: "1", text: "Xin chào" },
   { id: "2", text: "Mấy giờ chúng ta đi xem phim?" },
   { id: "3", text: "8 giờ tối, mình nghĩ vậy..." },
   { id: "4", text: "Thử thách trực quan" },
   { id: "5", text: "123" },
   { id: "6", text: "Abcefg........" },
   { id: "7", text: "Qwertyuio" },
   { id: "8", text: "Hay :)" },
   { id: "9", text: "Thử nghiệm 1..2..3" },
   { id: "10", text: "Qwertyuu :)" },
   { id: "11", text: "Mình đói" },
   { id: "12", text: "Mình muốn pizza" },
   { id: "13", text: "Mình cũng vậy" },
   { id: "14", text: "Sushi?" },
   { id: "15", text: "Không, pizza!!!!!" },
   { id: "16", text: "Ham và phô mai :D" },
];

const ChatRoom = () => {
   const [input, setInput] = useState("");

   const handleSend = () => {
      if (input.trim()) {
         messages.push({
            id: (messages.length + 1).toString(),
            text: input.trim(),
         });
         setInput("");
      }
   };

   return (
      <View style={styles.container}>
         <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{item.text}</Text>
               </View>
            )}
            inverted // Lật ngược danh sách để mới nhất ở trên cùng
         />
         <View style={styles.inputContainer}>
            <TextInput
               style={styles.input}
               value={input}
               onChangeText={setInput}
               placeholder="Nhập tin nhắn..."
               onSubmitEditing={handleSend}
            />
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f0f0f0",
   },
   messageContainer: {
      padding: 10,
      margin: 5,
      borderRadius: 5,
      backgroundColor: "#e5e5e5",
   },
   messageText: {
      fontSize: 16,
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#ffffff",
   },
   input: {
      flex: 1,
      borderColor: "#d3d3d3",
      borderWidth: 1,
      borderRadius: 20,
      padding: 10,
      fontSize: 16,
   },
});

export default ChatRoom;
