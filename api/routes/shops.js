const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();


app.use(bodyParser.urlencoded({extended: false}));

//Database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loxionbeanery'
});

//Returns all shops
router.get('/', (req, res, next) =>{
    conn.query("SELECT * FROM shops", (err, rows, fields) => {
        res.json(rows);
    });
});

//Returns a specific shop 
router.get('/:sID', (req, res, next) =>{
    conn.query("SELECT * FROM users WHERE sID = ?",[req.params.sID], (err, rows, fields) => {
        console.log(err);
        res.json(rows);
    });
});

//insert a user
router.post('/', (req, res, next) =>{
    res.status(200).json({
        message: 'POST request'
    })
});

//Returns a specific user 
router.post('/Login', (req, res) =>{
    //const userID = req.params.id;
    res.json([{
        message: req.body.uID
    }]);
    /*conn.query("SELECT * FROM users WHERE uID = ?",[req.body.uID], (err, rows, fields) => {
        console.log(err);
        res.json([{
            message: req.body.uID
        }]);
    });*/
});

module.exports = router;