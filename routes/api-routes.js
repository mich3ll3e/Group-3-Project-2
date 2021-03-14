const db = require("../models");

module.exports = app => {
  app.post("/api/signup", (req, res) => {
    console.log(req.body);
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
};
