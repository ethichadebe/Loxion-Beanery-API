const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));

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
           shops:rows
       })
       
    });
});

//Returns all orders for a specific shop
router.get('/:sID', (req, res, next) => {
    conn.query("SELECT * FROM `orders` WHERE sID=?", req.params.sID, (err, rows, fields) => {
       console.log(rows);
        res.json({
           shops:rows
       })
       
    });
});

//Returns all passed orders for a specific shop
router.get('/:sID/:', (req, res, next) => {
    conn.query("SELECT * FROM `orders`", (err, rows, fields) => {
       console.log(rows);
        res.json({
           shops:rows
       })
       
    });
});

//Returns all upcoming orders for a specific shop
router.get('/', (req, res, next) => {
    conn.query("SELECT * FROM `orders`", (err, rows, fields) => {
       console.log(rows);
        res.json({
           shops:rows
       })
       
    });
});

//Returns all upcoming orders for a specific user
router.get('/', (req, res, next) => {
    conn.query("SELECT * FROM `orders`", (err, rows, fields) => {
       console.log(rows);
        res.json({
           shops:rows
       })
       
    });
});

//Returns all passed orders for a specific user
router.get('/', (req, res, next) => {
    conn.query("SELECT * FROM `orders`", (err, rows, fields) => {
       console.log(rows);
        res.json({
           shops:rows
       })
       
    });
});

//Returns all Menuitems for each shop
router.get('/MenuItems/:sID', (req, res, next) => {
    conn.query("SELECT * FROM `menuitems` WHERE sID = ?",req.params.sID, (err, rows, fields) => {
       console.log(rows);
        res.json({
           menuItems:rows
       })
       
    });
});

//Returns all Ingredients for each shop
router.get('/Ingredients/:sID', (req, res, next) => {
    conn.query("SELECT * FROM `ingredients` WHERE sID = ?",req.params.sID, (err, rows, fields) => {
       console.log(rows);
        res.json({
           menuItems:rows
       })
       
    });
});

//Register shop
router.post('/Register', (req, res, next) => {
    const insQuery = "INSERT INTO orders(`oIngredients`,`oPrice`,`oTime`, `oRating`, `oStatus`, `sID`,`uID`) VALUES (?, ?, ?, ?, 0, ?, ?)";

    conn.query(insQuery, [req.body.oIngredients, req.body.oPrice, req.body.oTime, req.body.oRating, req.body.sID, req.body.uID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: result.insertId
        })
    });
});

module.exports = router;