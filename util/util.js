const mysql = require('mysql');
//Database connection
const conn = mysql.createConnection({
    host: 'sql205.epizy.com',
    user: 'epiz_24959421',
    password: 'rFPpERvM61L',
    database: 'epiz_24959421_loxionbeanery'
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

