

const socketio = require('socket.io');
const path = require('path');
const http = require('http')
const express = require('express');
const formatMessage = require('./formatMessage');
const { joinRoom, getUser, userLeave, getRoomUsers } = require('./user');
const app = express();

// const io = socketio(app);

const chatBot = 'royalChat';
const PORT = 3002 || process.env.PORT;

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket=>{
    
    
    // catches the frontend input message
    socket.on('chatMessage', msg=>{
        const user = getUser(socket.id);
        console.log(user)
        io.to(user.room).emit('message',formatMessage(user.username,msg ));
    })

    // receives the emitted message from the frontend;
    socket.on("joinRoom",({username, room})=>{
        const user = joinRoom(socket.id, username, room)

        socket.join(user.room)

    // sends message to the user that just joined;
    socket.emit('message', formatMessage(chatBot,`welcome to the chat group ${user.username}`));

    // this helps change the room display on the left
    socket.emit('userAndRoom', ({username,room}));


// emits the people in the room and fixes them on the left;
    io.to(user.room).emit('userInRoom', 
        ({ room:user.room, users : getRoomUsers(user.room)}));


    // broadcast message to everybody except the user who logged in;
    socket.broadcast.to(user.room).emit('message', formatMessage(chatBot,`${user.username} has just connected`));

    })
    // above is the end of the joinRoom event;

    // runs when client disconnect
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if(user) {io.to(user.room).emit('message', formatMessage(chatBot,`${user.username} has left the chat`))};

        // emits the people in the room and fixes them on the left;
        // console.log(user.room)
        // io.to(user.room).emit('userInRoom', 
        // ({ room:user.room, users : getRoomUsers(user.room)}));
        
    })
 })
app.use(express.static(path.join(__dirname , 'public')));
server.listen(3002, console.log('welcome to the socket'));
