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
    conn.query("SELECT * FROM orders WHERE sID = ? AND (orders.oStatus = 'Waiting for order' OR orders.oStatus = 'Ready for collection')", req.params.sID, (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all passed orders for a specific shop
router.get('/shopPast/:sID', (req, res, next) => {
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
router.get('/shopUpcoming/:sID', (req, res, next) => {
    conn.query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =?)", [req.params.sID], (err, rows, fields) => {
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

//Returns all Past orders for a specific user
router.get('/Past/:uID', (req, res, next) => {
    conn.query("SELECT * FROM orders INNER JOIN shops ON orders.sID = shops.sID AND (orders.uID = 57 AND orders.oStatus = 'Collected')", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message:"orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Upcoming orders for a specific user
router.get('/Upcoming/:uID', (req, res, next) => {
    conn.query("SELECT * FROM orders INNER JOIN shops ON orders.sID = shops.sID AND (orders.uID = ? AND orders.oStatus != 'Collected')", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message:"orders",
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
router.post('/Order', (req, res, next) => {
    const insQuery = "INSERT INTO orders(`oIngredients`,`oExtras`,`oPrice`, `sID`,`uID`,`createdAt`) VALUES (?, ?, ?, ?, ?, '" + createdAt() + "')";

    conn.query(insQuery, [req.body.oIngredients, req.body.oExtras, req.body.oPrice, req.body.sID, req.body.uID], (err, result, fields) => {
        console.log(err);
        console.log(result.insertId);
        res.json({
            data: result.insertId
        })
    });
});

//Send order to shop
router.put('/Arrived/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oRecievedAt = '" + createdAt() + "', oStatus = 'Waiting for order' WHERE oID = ?";

    conn.query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "updated"
        })
    });
});

//Order Complete to shop
router.put('/Ready/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oFinishedAt = '" + createdAt() + "', oStatus = 'Ready for collection' WHERE oID = ?";

    conn.query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "updated"
        })
    });
});

//Cancel order
router.put('/Cancel/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oColectedAt = '" + createdAt() + "', oStatus = 'Canceled' WHERE oID = ?";

    conn.query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "Canceled"
        })
    });
});

//Collected order
router.put('/Collected/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oColectedAt = '" + createdAt() + "', oStatus = 'Collected' WHERE oID = ?";

    conn.query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res. json({
            data: "Canceled"
        })
    });
});

module.exports = router;