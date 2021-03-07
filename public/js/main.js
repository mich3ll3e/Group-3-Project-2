$(document).ready(function(){
    
const chatMessages = $("#chat-message");
const socket = io();

let  user ;

$.get("/api/user_data").then(function(data) { 
   user = data
  });


//Message from Server
socket.on("message", message =>{
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

$("#chat-form").on('submit', event =>{
    event.preventDefault();
    
    //get message text
    const msg = {}
    msg.text = $("#msg").val();
    msg.userName = user.username;
    msg.id = user.id;
    
    
    
    //emiting message to the server
    socket.emit("chatMessage",msg);
    $.ajax("/api/messages", {
        type: "POST",
        data: msg
      }).then(function() {
        //   location.replace("/chat");
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(function(err) {
          console.log(err);
        });
    //clear Input 
    $("#msg").val("");
    $("#msg").focus();

    

});

//output message to DOM
    function outputMessage(message){
        const div = document.createElement("div");
        div.classList.add("message","p-3", "card");
        div.innerHTML = `<h4>${message.username} </h4>
        <p>${message.text}  <span style="font-size:10px">${message.time}</span></p>`;
        chatMessages.append(div);
    }
});
