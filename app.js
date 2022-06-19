//jshint esversion:6

const https = require("https");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// API key for openweathermap API
const apiKey = "Insert Your API Key";

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+units+"";
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png";

      res.write("<p>The weather is currently: "+weatherDescription+"</p>");
      res.write("<h1>The temp in "+ query +" is " + temp + " degrees Celcius.</h1>");
      res.write("<img src="+iconURL+" alt='weather icon'>");

      res.send();
    });
  });

});



app.listen(3000, function() {
  console.log("Weather App Server started on port 3000");
});
