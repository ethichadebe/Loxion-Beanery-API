const mysql = require('mysql');
//Database connection
const conn = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    database: 'sql7343964',
    user: 'sql7343964',
    password: 'xcAqe3Dk98',
    port: '3306'
});

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
    }
};

