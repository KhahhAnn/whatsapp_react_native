import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { MYIP } from '../../constants/Utils';
import socket from '../Socket/socketConnect';

const CallVoice = () => {
   const route = useRoute();
   const { to, from, userStore } = route.params;

   useEffect(() => {
      const openCallPopUp = async (isVideoCall) => {
         const callId = uuidv4();
         const endpoint = `${MYIP.Myip}/api/call/call-start`;
   
         const callerId= from;
         const callerName = to.nickname;
         const receiverId = to.contactUserId;
         const receiverName = "An";
         const callType = "gọi thoại";
   
         try {
            const response = await fetch(endpoint, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userStore.accessToken}`,
               },
               body: JSON.stringify({
                  callerId,
                  callerName,
                  receiverId,
                  receiverName,
                  callType
               }),
            });
   
            if (!response.ok) {
               const errorText = await response.text();
               console.log("Error:", response.status, errorText);
               throw new Error("Error fetching contacts");
            } else {
               const data = await response.json();
               console.log("data", data);
            }
         } catch (error) {
            console.error("Error fetching contacts:", error.message);
         }
   
         socket.emit('privateCall', {
            from: callerId,
            to: receiverId,
            callId
         });
      }
         
      openCallPopUp(false);
   }, []);

   

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>CallVoice</Text>
      </View>
   );
};

export default CallVoice;
