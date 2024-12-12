import {
   View,
   Text,
   Image,
   Pressable,
   TextInput,
   TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../Login/Button";
import COLORS from "../../constants/COLOR";
import { MYIP } from "../../constants/Utils";

const Register = ({ navigation }) => {
   const ipv4 = MYIP.Myip;

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [passwordConfirm, setPasswordConfirm] = useState("");
   const [username, setUsername] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [isPasswordShown, setIsPasswordShown] = useState(true);

   const handlePasswordConfirm = () => {
      if (password !== passwordConfirm) {
         setErrorMessage("Mật khẩu không khớp");
      } else {
         setErrorMessage("");
      }
   };

   const handleSignUp = async () => {
      handlePasswordConfirm();
      const endpoint = `http://${ipv4}:8080/api/account/register`;
      try {
         const response = await fetch(endpoint, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            email: email,
            password: password,
            userName: username,
            phoneNumber: phoneNumber,
         }),
         });
         if (response.ok) {
         console.log("Đăng ký thành công");
         navigation.navigate("SignIn");
         } else {
         console.error("Đăng ký thất bại");
         }
      } catch (error) {
         console.error("Lỗi khi đăng ký:", error);
      }
   };

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
         <View style={{ flex: 1, marginHorizontal: 22 }}>
         <View style={{ marginVertical: 22 }}>
            <Text
               style={{
               fontSize: 22,
               fontWeight: "bold",
               marginVertical: 12,
               color: COLORS.black,
               }}
            >
               Tạo Tài Khoản
            </Text>

            <Text
               style={{
               fontSize: 16,
               color: COLORS.black,
               }}
            >
               Kết nối với bạn bè ngay hôm nay!
            </Text>
         </View>

         <View style={{ marginBottom: 12 }}>
            <Text
               style={{
               fontSize: 16,
               fontWeight: 400,
               marginVertical: 8,
               }}
            >
               Địa chỉ Email
            </Text>

            <View
               style={{
               width: "100%",
               height: 48,
               borderColor: COLORS.black,
               borderWidth: 1,
               borderRadius: 8,
               alignItems: "center",
               justifyContent: "center",
               paddingLeft: 22,
               }}
            >
               <TextInput
               placeholder="Nhập email của bạn"
               placeholderTextColor={COLORS.black}
               keyboardType="email-address"
               onChangeText={(text) => setEmail(text)}
               style={{
                  width: "100%",
               }}
               />
            </View>
         </View>

         <View style={{ marginBottom: 12 }}>
            <Text
               style={{
               fontSize: 16,
               fontWeight: 400,
               marginVertical: 8,
               }}
            >
               Số điện thoại
            </Text>

            <View
               style={{
               width: "100%",
               height: 48,
               borderColor: COLORS.black,
               borderWidth: 1,
               borderRadius: 8,
               alignItems: "center",
               justifyContent: "center",
               paddingLeft: 22,
               }}
            >
               <TextInput
               placeholder="Nhập số điện thoại của bạn"
               placeholderTextColor={COLORS.black}
               keyboardType="phone-pad"
               onChangeText={(text) => setPhoneNumber(text)}
               style={{
                  width: "100%",
               }}
               />
            </View>
         </View>

         <View style={{ marginBottom: 12 }}>
            <Text
               style={{
               fontSize: 16,
               fontWeight: 400,
               marginVertical: 8,
               }}
            >
               Mật khẩu
            </Text>

            <View
               style={{
               width: "100%",
               height: 48,
               borderColor: COLORS.black,
               borderWidth: 1,
               borderRadius: 8,
               alignItems: "center",
               justifyContent: "center",
               paddingLeft: 22,
               }}
            >
               <TextInput
               placeholder="Nhập mật khẩu của bạn"
               placeholderTextColor={COLORS.black}
               secureTextEntry={isPasswordShown}
               onChangeText={(text) => setPassword(text)}
               style={{
                  width: "100%",
               }}
               />

               <TouchableOpacity
               onPress={() => setIsPasswordShown(!isPasswordShown)}
               style={{
                  position: "absolute",
                  right: 12,
               }}
               >
               {isPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
               ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
               )}
               </TouchableOpacity>
            </View>
         </View>

         <View style={{ marginBottom: 12 }}>
            <Text
               style={{
               fontSize: 16,
               fontWeight: 400,
               marginVertical: 8,
               }}
            >
               Xác nhận mật khẩu
            </Text>

            <View
               style={{
               width: "100%",
               height: 48,
               borderColor: COLORS.black,
               borderWidth: 1,
               borderRadius: 8,
               alignItems: "center",
               justifyContent: "center",
               paddingLeft: 22,
               }}
            >
               <TextInput
               placeholder="Nhập lại mật khẩu của bạn"
               placeholderTextColor={COLORS.black}
               secureTextEntry={isPasswordShown}
               onChangeText={(text) => setPasswordConfirm(text)}
               style={{
                  width: "100%",
               }}
               />

               <TouchableOpacity
               onPress={() => setIsPasswordShown(!isPasswordShown)}
               style={{
                  position: "absolute",
                  right: 12,
               }}
               >
               {isPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
               ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
               )}
               </TouchableOpacity>
            </View>
         </View>

         <View style={{ marginBottom: 12 }}>
            <Text
               style={{
               fontSize: 16,
               fontWeight: 400,
               marginVertical: 8,
               }}
            >
               Tên người dùng
            </Text>

            <View
               style={{
               width: "100%",
               height: 48,
               borderColor: COLORS.black,
               borderWidth: 1,
               borderRadius: 8,
               alignItems: "center",
               justifyContent: "center",
               paddingLeft: 22,
               }}
            >
               <TextInput
               placeholder="Nhập tên người dùng của bạn"
               placeholderTextColor={COLORS.black}
               onChangeText={(text) => setUsername(text)}
               style={{
                  width: "100%",
               }}
               />
            </View>
         </View>

         <Button
            title="Đăng ký"
            filled
            style={{
               marginTop: 18,
               marginBottom: 4,
            }}
            onPress={handleSignUp}
         />

         <View
            style={{
               flexDirection: "row",
               justifyContent: "center",
               marginVertical: 22,
            }}
         >
            <Text style={{ fontSize: 16, color: COLORS.black }}>
               Đã có tài khoản?
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
               <Text
               style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontWeight: "bold",
                  marginLeft: 6,
               }}
               >
               Đăng nhập
               </Text>
            </Pressable>
         </View>

         {errorMessage ? (
            <View style={{ marginVertical: 10, alignItems: "center" }}>
               <Text style={{ color: "red" }}>{errorMessage}</Text>
            </View>
         ) : null}
         </View>
      </SafeAreaView>
   );
};

export default Register;
