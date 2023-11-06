


const chatForm  = document.getElementById('chatForm');
const divSection  = document.querySelector('.section2');
const sectionH6  = document.querySelector('.section1 h6');
const userList = document.querySelector('.userList');



// get the query string parameters;
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
})

// we have access to the io method throught the script we fixed in the chat.html ;
const socket = io();
 
// gets all the message events;
socket.on('message', message=>{

    displayMessage(message)

    const msg = chatForm.querySelectorAll('input')[0];
    msg.value = '';
    msg.focus();

    divSection.scrollTop = divSection.scrollHeight;


})
socket.emit("joinRoom",{username, room});

socket.on('userInRoom', ({room , users}) => {
    addUsersToList(users);
})


socket.on('userAndRoom', ({username, room}) =>{
    changeRoom(room);
})

chatForm.addEventListener("submit", e=>{
    // prevents page reload;
    e.preventDefault();

    // gets text input;
    const msg = e.target.querySelectorAll('input')[0].value;
    // emits the message the user inputs;
    socket.emit('chatMessage',msg);
})

const displayMessage = (message) =>{
    const div = document.createElement('div');
    div.classList.add('chatComponent');
    div.innerHTML = `
    <p> ${message.username} ${message.time} 
    </p>
    <p> ${message.message}</p>`

    divSection.appendChild(div)
    
}

const changeRoom = (room) =>{
    sectionH6.textContent = room;
}

const addUsersToList = users =>{
    users.map(user =>{
        const li =  document.createElement('li');
        li.textContent = user.username;
        userList.appendChild(li);
    })
}