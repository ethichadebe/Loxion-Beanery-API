const mysql = require('mysql');
const multer = require('multer');
const express = require('express');
const firebase = require('firebase-admin');
const router = express.Router();

var serviceAccount = require("/app/util/service_account.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://loxion-beanery-78c17.firebaseio.com"
});

//Image uploader
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + file.originalname);
    }
});

const upload = multer({ storage: storage });


//Database connection remote 
const conn = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    database: 'sql7351092',
    user: 'sql7351092',
    password: 'i4eRNl6Eha',
    port: '3306'
});

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
        return currentdate.getFullYear() + "-"
            + addZero("" + (currentdate.getMonth() + 1)) + "-"
            + addZero("" + currentdate.getDate()) + " "
            + addZero("" + currentdate.getHours()) + ":"
            + addZero("" + currentdate.getMinutes()) + ":"
            + addZero("" + currentdate.getSeconds());

    },

    //Database connection    
    conn: function () {
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
        firebase.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                res;
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                this.sendNotification(topic, notification, data);
            });
    }
};

