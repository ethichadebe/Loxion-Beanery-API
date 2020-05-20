

const mysql = require('mysql');

//Database connection
export const conn = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7339875',
    password: 'tcyCE9lpMR',
    database: 'sql7339875',
    port: '3306'
});

//add zero to signle digit date and times
export function addZero(data) {
    if (data.length < 2) {
        return "0" + data;
    }
    return data;
}

//Current date time generator
export function createdAt() {
    var currentdate = new Date();
    return currentdate.getFullYear() + "-"
        + addZero("" + (currentdate.getMonth() + 1)) + "-"
        + addZero("" + currentdate.getDate()) + " "
        + addZero("" + currentdate.getHours()) + ":"
        + addZero("" + currentdate.getMinutes()) + ":"
        + addZero("" + currentdate.getSeconds());

}
