const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = app => {
  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  //chatroom route, gets all users and past messages
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

  app.get("/profile", isAuthenticated, (req, res) => {
    console.log(req.user.id);
    db.Message.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(dbMessags => {
      console.log(dbMessags);
      res.render("profile", { user: req.user, messages: dbMessags });
    });
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

  app.get("/", (req, res) => {
    res.render("index");
  });
};
