/* eslint-disable prefer-arrow-callback */
$(document).ready(function() {
  const chatMessages = $("#chat-message");
  const socket = io();

  let user;

  $.get("/api/user_data").then(function(data) {
    user = data;
  });

  //Message from Server
  socket.on("message", message => {
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  $("#chat-form").on("submit", event => {
    event.preventDefault();

    const newMoment = moment();

    //get message text
    const msg = {};
    msg.text = $("#msg").val();
    msg.userName = user.username;

    msg.time = newMoment.format("hh:mm");

    const div = document.createElement("div");
    div.classList.add(
      "message",
      "p-3",
      "card",
      "text-right",
      "message",
      "my-message"
    );
    div.innerHTML = `<h6>You </h6>
        <p class="lead m-0">${msg.text}  <span class="message-text">${msg.time}</span></p>`;
    chatMessages.append(div);

    //emiting message to the server
    socket.emit("chatMessage", msg);
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
  const div = document.createElement("div");
  div.classList.add("message", "p-3", "card", "mb-3", "message");
  div.innerHTML = `<h4>${message.username} </h4>

        <p>${message.text}  <span style="font-size:10px">${message.time}</span></p>`;
  chatMessages.append(div);
}
