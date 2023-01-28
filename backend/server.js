const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
dotenv.config({ path: path.resolve(__dirname, '../.env') });;
const { errorHandler, notFound } = require('./middlewares/errorMiddlewares');
// Imp line
connectDB();
const app=express();
app.use(express.json());
app.use('/api/users',userRoutes); 
app.use('/api/chat',chatRoutes); 
app.use("/api/message", messageRoutes);
// Error handler 

app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log(`Server started on port ${PORT} `));

// ============== SOCKET IO =============
const io = require("socket.io")(server, {
    pingTimeout: 60000,     // is user is offline for more than 60 seconds then it would close 
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
//   Each new connection is assigned a random 20-characters identifier
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // INDIVIDUAL socket for each user 
    // creating room for each user
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    // this is new message object
    socket.on("new message", (newMessageRecieved) => {
      
      // when we receive new msg we need to see in which room we need to send the msg
      var chat = newMessageRecieved.chat;
  
    
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
          
          // in a group if new msg received then do not send it to user itself
          if (user._id == newMessageRecieved.sender._id) return;
        
          // socket.in means that user's room emit or send that msg
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });