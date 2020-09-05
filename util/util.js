const mysql = require("mysql");
const multer = require("multer");
const express = require("express");
const firebase = require("firebase-admin");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const router = express.Router();

const serviceAccount = require("/app/util/service_account.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://loxion-beanery-78c17.firebaseio.com",
});

aws.config.update({
  secretAccessKey: "LznJGQ9FEqYa3PRVlBYtAs4haRK2Ed8+C+k2sQMy",
  accessKeyId: "AKIAIM4XPZKM7437RH6Q",
  region: "eu-west-3",
});
var s3 = new aws.S3();

//Image uploader
const storage = multerS3({
  s3: s3,
  bucket: "loxionbeanery",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.originalname });
  },
  key: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Database connection remote
const conn = mysql.createConnection({
  host: "sql7.freemysqlhosting.net",
  database: "sql7363933",
  user: "sql7363933",
  password: "xQWN941cu4",
  port: "3306",
});

/*const conn = mysql.createConnection({
    host: 'sql205.epizy.com',
    database: 'epiz_24959421_loxionbeanery',
    user: 'epiz_24959421',
    password: 'hzfnj6gv',
    port: '3306'
});*/

//Database connection local
/*const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loxionbeanery'
});*/

//add zero to signle digit date and times
function addZero(data) {
  if (data.length < 2) {
    return "0" + data;
  }
  return data;
}

module.exports = {
  //Current date time generator
  createdAt: function () {
    var currentdate = new Date();
    return (
      currentdate.getFullYear() +
      "-" +
      addZero("" + (currentdate.getMonth() + 1)) +
      "-" +
      addZero("" + currentdate.getDate()) +
      " " +
      addZero("" + currentdate.getHours()) +
      ":" +
      addZero("" + currentdate.getMinutes()) +
      ":" +
      addZero("" + currentdate.getSeconds())
    );
  },

  //Database connection
  conn: function (err) {
    return conn;
  },

  //Upload
  upload: function () {
    return upload;
  },

  //Upload
  router: function () {
    return router;
  },

  /*"message": {
        "topic": "subscriber-updates",
        "notification": {
            "title": "NewsMagazine.com",
            "body": "This week's edition is now available.",
            "click_action": "OPEN_ACTIVITY_1",
            "priority": "normal"
        },
        "data": {
            "volume": "3.21.15",
            "contents": "http://www.news-magazine.com/world-week/21659772"
        },
    }*/

  sendNotification: function (message, res) {
    var message = message;

    // Send a message to devices subscribed to the provided topic.
    firebase
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        res;
      })
      .catch((error) => {
        console.log("Error sending message:", error);
        this.sendNotification(topic, notification, data);
      });
  },
};
