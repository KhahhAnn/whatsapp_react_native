
// export const setupSocketServer = ('socket', () => {
//    const isLoggedIn = ref(false)
//    const messages = ref([]) // Danh sách tin nhắn
//    const messageStore = useMessageStore()
//    const contactStore = useContactStore()
//    const callStore = useCallStore()

//    const connect = () => {
//       if (!isLoggedIn.value && !socket.connected) {
//          //Truyền userid từ localstorage vào socket để xác thực
//          socket.auth = {
//             userId: localStorage.getItem('userId')
//          }
//          console.log('Connect socket: ', socket.auth)
//          socket.connect()
//       }
//    }

//    //Lắng nghe sự kiện kết nối socket
//    socket.on('connect', () => {
//       isLoggedIn.value = true
//    })

//    socket.on('getUsersOnline', (usersData) => {
//       console.log('Users online: ', usersData)
//    })

//    socket.on('userJustConnected', (userData) => {
//       console.log('User just connected: ', userData)
//    })

//    // Lắng nghe sự kiện contactRequest
//    socket.on('contactRequest', (data) => {
//       alert(`User ${data.from} wants to add you as a contact!`)
//       // Bạn có thể thêm logic để xử lý yêu cầu thêm liên hệ ở đây
//       // socket.emit('contactRequestResponse', {
//       //   from: data.from,
//       //   response: 'accept'
//       // })
//    })

//    const sendCall = ({ from, to, callId }) => {
//       console.log('🚀 calling', { from, to, callId })
//       socket.emit('privateCall', {
//          from,
//          to,
//          callId
//       })
//    }

//    const sendMessage = (message, from, to) => {
//       socket.emit('privateMessage', {
//          message,
//          from,
//          to
//       })
//       console.log('Send message: ', message, to)
//    }

//    const listenForMessages = () => {
//       socket.on('privateMessageToReceiver', ({ message, from }) => {
//          const currentContactId = contactStore.selectedContact.contactUserId
//          if (currentContactId === from) {
//             messages.value.push({ content: message, from })
//             messageStore.addMessage({ content: message, from })
//             console.log('Received message: ', message, from)
//          }
//       })

//       socket.on('privateCallToReceiver', ({ from, callId }) => {
//          console.log('Received call: ', { from, callId })
//          callStore.setIncomingCall({ from, callId })
//       })
//    }

//    // Gọi phương thức này khi khởi tạo store
//    listenForMessages()

//    const sendGroupMessage = (groupId, message) => {
//       socket.emit('groupMessage', {
//          groupId,
//          message
//       })
//       console.log('Send group message: ', message, groupId)
//    }

//    const listenForGroupMessages = () => {
//       socket.on('groupMessageToMembers', ({ message, from }) => {
//          // Xử lý tin nhắn nhóm nhận được
//          console.log('Received group message: ', message, from)
//          // Bạn có thể thêm logic để cập nhật danh sách tin nhắn nhóm ở đây
//       })
//    }

//    // Gọi phương thức này khi khởi tạo store
//    listenForGroupMessages()

//    socket.on('disconnect', () => {
//       isLoggedIn.value = false
//       console.log('Socket disconnected')
//    })
// })

