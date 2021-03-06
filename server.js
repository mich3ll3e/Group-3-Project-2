const express = require("express");
const db = require("./models");

const PORT = process.env.PORT || 8080;
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const indexRoutes = require("./controllers/index-contoller");

app.use(indexRoutes);


db.sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Listening on port", PORT)
    });
});