const express = require("express");
const session = require("express-session");
const http = require("http");
const socketio = require("socket.io");
// eslint-disable-next-line no-unused-vars
const moment = require("moment");
const formatMessage = require("./utils/messages");
const passport = require("./config/passport");
const isAuthenticated = require("./config/middleware/isAuthenticated");
const db = require("./models");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/handlbars-routes")(app);

const exphbs = require("express-handlebars");

const hbs = exphbs.create({
  defaultLayout: "main",
  //create custome helpers
  helpers: {
    ifCond: function(v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    equalTo: function(value1, value2) {
      if (value1 === value2) {
        return true;
      }
      return false;
    }
  }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

const botName = "ChatBot";
let user = {};

io.on("connection", socket => {
  //welcome current user
  socket.emit(
    "message",
    formatMessage(botName, `welcome to chat ${user.username}`)
  );

  //Bordcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, `${user.username} has joined the chat`)
  );

  //when client disconnects
  socket.on("disconnect", () => {
    io.emit(
      "message",
      formatMessage(botName, `${user.username} has left the chat`)
    );
  });

  //Listen for chat Message
  socket.on("chatMessage", msg => {
    socket.broadcast.emit("message", formatMessage(msg.userName, msg.text));
  });
});

app.post("/api/signup", (req, res) => {
  db.User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
      res.status(401).json(err);
    });
});
app.put("/api/update/:id", (req, res) => {
  console.log(req.body);
  const updatedUser = {
    username: req.body.username,
    email: req.body.email
  };
  db.User.update(updatedUser, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.send({ msg: "user updated" });
  });
});

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  user = req.user;
  res.json(req.user);
});

app.post("/api/messages", (req, res) => {
  db.Message.create({
    body: req.body.text,
    UserId: req.body.UserId
  })
    .then(() => {
      res.redirect("/chat");
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

app.get("/api/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea

    res.json({
      username: req.user.username,
      id: req.user.id,
      isOnline: req.user.isOnline
    });
  }
});

app.delete("/api/delete/:id", (req, res) => {
  console.log(req.params.id);
  db.Message.destroy({
    where: {
      UserId: req.params.id
    }
  }).then(() => {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.send({ msg: "User Deleted" });
    });
  });
});

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log("app working" + PORT);
  });
});
