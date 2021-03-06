
const chatFrom = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-message");
const socket = io();

const  userName = "user"+ Math.floor(Math.random()*1000);


//Message from Server
socket.on("message", message =>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatFrom.addEventListener('submit', event =>{
    event.preventDefault();
    //get message text
    const msg = {}
    msg.text = event.target.msg.value;
    msg.userName = userName;
    
    //emiting message to the server
    socket.emit("chatMessage",msg);
    //clear Input 
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();

});

//output message to DOM
function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p>${message.username} <span>${message.time}</span></p>
    <p>${message.text}</p>`;
    chatMessages.appendChild(div);
}