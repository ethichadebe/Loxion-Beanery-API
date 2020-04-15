const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));

//add zero to signle digit date and times
function addZero(data) {
    if (data.length < 2) {
        return "0" + data;
    }
    return data;
}

//Current date time generator
function createdAt() {
    var currentdate = new Date();
    return currentdate.getFullYear() + "-"
        + addZero("" + (currentdate.getMonth() + 1)) + "-"
        + addZero("" + currentdate.getDate()) + " "
        + addZero("" + currentdate.getHours()) + ":"
        + addZero("" + currentdate.getMinutes()) + ":"
        + addZero("" + currentdate.getSeconds());

}

//Database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loxionbeanery'
});

//Returns all orders
router.get('/', (req, res, next) => {
    conn.query("SELECT * FROM `orders`", (err, rows, fields) => {
        console.log(rows);
        res.json({
            shops: rows
        })

    });
});

//Returns all orders for a specific shop
router.get('/:sID', (req, res, next) => {
    conn.query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID)", req.params.sID, (err, rows, fields) => {
        console.log(rows);
        res.json({
            shops: rows
        })

    });
});

//Returns all passed orders for a specific shop
router.get('/Past/:sID', (req, res, next) => {
    conn.query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =49)", [req.params.sID], (err, rows, fields) => {
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all upcoming orders for a specific shop
router.get('/Upcoming/:sID', (req, res, next) => {
    conn.query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =49)", [req.params.sID], (err, rows, fields) => {
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all upcoming orders for a specific user
router.get('/Upcoming/:uID', (req, res, next) => {
    conn.query("SELECT * FROM `orders` WHERE `uID` = ? AND (`oStatus` = 0 OR `oStatus` = 1 OR `oStatus` = 2 OR `oStatus` = 3)", [req.params.uID], (err, rows, fields) => {
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all passed orders for a specific user
router.get('/Past/:uID', (req, res, next) => {
    conn.query("SELECT * FROM `orders` WHERE `uID` = ?", [req.params.uID], (err, rows, fields) => {
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Register shop
router.post('/Register', (req, res, next) => {
    const insQuery = "INSERT INTO orders(`oIngredients`,`oPrice`, `oRating`, `oStatus`, `sID`,`uID`,`createdAt`) VALUES (?, ?, 0, 0, ?, ?, '" + createdAt() + "')";

    conn.query(insQuery, [req.body.oIngredients, req.body.oPrice, req.body.sID, req.body.uID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: result.insertId
        })
    });
});

module.exports = router;