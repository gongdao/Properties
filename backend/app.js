const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const unitsRoutes = require("./routes/units")

const app = express();
//console.log("this is app.js");

mongoose
  .connect(
    "mongodb://localhost/node-angular"
  ) // works

//mongoose.connect("mongodb+srv://buzhaobin:tzA9y-u67zbfURN@buildingm-dzacs.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
//mongoose.connect("mongodb://buzhaobin:tzA9y-u67zbfURN@buildingm-shard-00-00-dzacs.mongodb.net:27017,buildingm-shard-00-01-dzacs.mongodb.net:27017,buildingm-shard-00-02-dzacs.mongodb.net:27017/test?ssl=true&replicaSet=BuildingM-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to mongodb.');
  }).catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/units", unitsRoutes)

module.exports = app;
