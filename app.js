require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const e = require("express");
const saltRounds = 12;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "ThisIsTopSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
// mongoose.set("useCreateIndex", true);

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

// Uncomment to activate db encryption using mongoose
//
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, {
//   secret: secret,
//   encryptedFields: ["password"],
// });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {
  req.logout(function () {
    console.log("Successfully logged out.");
  });
  res.redirect("/");
});

app.post("/register", function (req, res) {
  // Using bcrypt to hash password
  //   bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
  //     const newUser = new User({
  //       email: req.body.username,
  //       password: hash,
  //     });

  //     newUser.save(function (err) {
  //       if (err) {
  //         console.log(err);
  //         res.send("Oops! There was some error!");
  //       } else {
  //         res.render("secrets");
  //       }
  //     });
  //   });

  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("secrets");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Using bcrypt
  //
  //   User.findOne({ email: username }, function (err, foundUser) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       if (foundUser) {
  //         bcrypt.compare(password, foundUser.password, function (err, result) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             if (result === true) res.render("secrets");
  //           }
  //         });
  //       }
  //     }
  //   });

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  passport.authenticate("local")(req, res, function () {
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/secrets");
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
