//jshint esversion:8

const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const mailchimpApiKey = "e58f579fa197a634da36239c12cc4fd3-us9";
const mailchimpListId = "3734b98cae";
const mailchimpServer = "us9";

const app = express();

// using public folder as static so it can be accessed by index.html
app.use(express.static("public"));
// using body parser
app.use(bodyParser.urlencoded({extended: true}));

// setting up config for mailchimp so it can be used
mailchimp.setConfig({
  apiKey: mailchimpApiKey,
  server: mailchimpServer,
});

async function mailchimpPing() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

// adds a member to mailchimp list
// throws error if member is already in the list
async function mailchimpAddListMember(userData, res) {
  try {
    const response = await mailchimp.lists.addListMember(mailchimpListId, userData);
    console.log(response);
    if (response.status == "subscribed") {
      res.sendFile(__dirname + "/success.html");
    }
  }
  catch(e) {
    console.log(e.status);
    res.sendFile(__dirname + "/failure.html");
  }
}



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.post("/", function(req, res) {
  // res.sendFile(__dirname + "/index.html");
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var userData = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    }
  };

  mailchimpAddListMember(userData, res);

});


//
app.listen(process.env.PORT | 3000, function() {
  console.log("Server running...");
});
