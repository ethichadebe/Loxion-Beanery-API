const mysql = require('mysql');
const multer = require('multer');

//Database connection remote 
const conn = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    database: 'sql7347586',
    user: 'sql7347586',
    password: 'BLPiElweex',
    port: '3306'
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
    conn: function () {
        return conn;
    },
    upload: function () {
        return upload;
    }
};

