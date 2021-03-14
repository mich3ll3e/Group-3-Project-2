/* eslint-disable prefer-arrow-callback */
$(document).ready(function() {
  const tabContent = document.getElementById("tab-content");
  const socket = io();

  let user;

  $.get("/api/user_data").then(function(data) {
    user = data;
  });

  //Message from Server
  socket.on("message", message => {
    outputMessage(message);
    //scroll down when message is sent
    tabContent.scrollTop = tabContent.scrollHeight;
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
    //output current user message to DOM
    const div = $("<div>");
    div.addClass("message p-1 card message my-message");
    div.html(`<h6>You </h6>
    <p class="message-text">${msg.text}</p><span class="time-text text-right">${msg.time}</span>`);
    $("#chat-messages").append(div);

    //emiting message to the server
    socket.emit("chatMessage", msg);
    tabContent.scrollTop = tabContent.scrollHeight;
    $.ajax("/api/messages", {
      type: "POST",
      data: msg
    }).catch(function(err) {
      console.log(err);
    });
    //clear Input
    $("#msg").val("");
    $("#msg").focus();
  });
});

//output message to DOM
function outputMessage(message) {
  const div = $("<div>");
  div.addClass("message p-1 card mb-2 message");
  div.html(`<h6>${message.username} </h6>
    <p class="message-text">${message.text}</p><span class="time-text text-right">${message.time}</span>`);
  $("#chat-messages").append(div);
}
