/* eslint-disable prefer-arrow-callback */
$(document).ready(function() {
  const chatMessages = document.getElementById("chat-messages");
  const socket = io();

  let user;

  $.get("/api/user_data").then(function(data) {
    user = data;
  });

  //Message from Server
  socket.on("message", message => {
    outputMessage(message);

    //scroll down
    console.log(chatMessages.scrollTop);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  $("#chat-form").on("submit", event => {
    event.preventDefault();

    const newMoment = moment();

    //get message text
    const msg = {};
    msg.text = $("#msg").val();
    msg.userName = user.username;
    msg.UserId = user.id;
    msg.time = newMoment.format("hh:mm");

    const div = $("<div>");
    div.addClass("message p-3 card text-right message my-message");
    div.html(`<h6>You </h6>
    <p class="lead m-0">${msg.text}  <span class="message-text">${msg.time}</span></p>`);
    $("#chat-messages").append(div);

    //emiting message to the server
    socket.emit("chatMessage", msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    $.ajax("/api/messages", {
      type: "POST",
      data: msg
    })
      .then(function() {
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
});

//output message to DOM
function outputMessage(message) {
  console.log(message);
  const div = $("<div>");
  div.addClass("message p-3 card mb-3 message");
  div.html(`<h6>${message.username} </h6>
    <p class="lead m-0">${message.text}  <span class="message-text">${message.time}</span></p>`);
  $("#chat-messages").append(div);
}
