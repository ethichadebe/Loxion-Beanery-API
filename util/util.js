const mysql = require('mysql');
const multer = require('multer');
const express = require('express');
const firebase = require('firebase-admin');
const router = express.Router();

firebase.initializeApp();

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
    database: 'sql7349692',
    user: 'sql7349692',
    password: 'NeVxmJMrgv',
    port: '3306'
});

//Database connection local 
/*const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loxionbeanery'
});*/

module.exports = {
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

