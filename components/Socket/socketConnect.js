import { io } from 'socket.io-client';

const socket = io("https://whatsapp-server-7wow.onrender.com", {
   autoConnect: false
});

export default socket;
