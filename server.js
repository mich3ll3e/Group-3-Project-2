const express = require('express');
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const db = require("./models");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const botName = "ChatBot";

io.on("connection", socket=>{
    //welcome current user
    socket.emit("message",formatMessage(botName, "welcome to chat"));

    //Bordcast when a user connects
    socket.broadcast.emit("message", formatMessage(botName, "A User has joined the chat"));

    //when client disconnects
    socket.on("disconnect",()=>{
        io.emit("message", formatMessage(botName, "A User has left the chat"));
    });

    //Listen for chat Message
    socket.on("chatMessage",(msg)=>{
        io.emit("message",formatMessage(msg.userName, msg.text));
    });

});

app.get("/signup",(req,res)=>{
    res.render("signup");
});
app.get("/chat",(req,res)=>{
    res.render("chat");
});
app.get("/",(req,res)=>{
    res.render("index")
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/api/signup",(req,res)=>{
    console.log(req.body);
    db.User.create({
        username:req.body.username,
        password:req.body.password
    })
    .then(function() {
        res.redirect("/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
})

const PORT = process.env.PORT || 8080

db.sequelize.sync().then(()=>{
    server.listen(PORT, ()=>{
        console.log('app working' + PORT);
    });
})