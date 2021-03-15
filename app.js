const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
//app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/cipherDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const cipherSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", cipherSchema);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});
app.post("/", function(req, res) {
  if (req.body.login === "Login") {
    res.redirect("/login");
  } else {
    res.redirect("/register");
  }
});
app.get("/register", function(req, res) {
  res.sendFile(__dirname + "/register.html")
});
app.get("/bio", function(req, res) {
  res.sendFile(__dirname + "/bio.html")
});
app.get("/error", function(req, res) {
  res.sendFile(__dirname + "/error.html")
});
app.post("/register", function(req, res) {
  const userReg = req.body.username;
  const passReg = req.body.password;
  User.findOne({email: userReg}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        res.redirect("/error");
      } else {
        const newUser = new User({
          email: req.body.username,
          password: req.body.password
        });
        newUser.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/bio");
          }
        });
      }
    }
  });
});
app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/login.html")
});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.redirect("/bio");
        }
        else{
          res.redirect("/login");
        }
      }
      else{
        res.redirect("/login");
      }
    }
  });
});
app.post("/error",function(req,res){
  res.redirect("/login");
});
app.listen(3000, function() {
  console.log("System Started on port 3000");
});
