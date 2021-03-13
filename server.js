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

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/chat", isAuthenticated, (req, res) => {
  db.User.findAll({ order: [["isOnline", "DESC"]] }).then(dbUsers => {
    db.Message.findAll({
      include: db.User
    }).then(dbMessages => {
      res.render("chat", {
        users: dbUsers,
        messages: dbMessages,
        user: req.user
      });
    });
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/settings", isAuthenticated, (req, res) => {
  res.render("settings", { user: req.user });
});

app.get("/", (req, res) => {
  res.render("index");
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

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      throw err;
    }
    db.User.update(
      { isOnline: false },
      {
        where: {
          id: user.id
        }
      }
    ).then(dbUser => {
      console.log(`${dbUser} had logged off`);
    });
    res.redirect("/login"); //Inside a callback… bulletproof!
  });
});

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log("app working" + PORT);
  });
});
