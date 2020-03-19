const express = require('express');
const app = express();
const mysql = require('mysql');
const router = express.Router();

//Database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'loxionbeanery'
});

//Returns all users
router.get('/', (req, res, next) => {
    conn.query("SELECT * FROM users", (err, rows, fields) => {
        res.json({
            users: rows
        });
    });
});

//insert a user
router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'POST request'
    })
});

//Returns a specific user 
router.post('/Login', (req, res) => {
    const selectQuery = "SELECT * FROM users WHERE uNumber = ? AND uPassword = ?";
    conn.query(selectQuery, [req.body.uNumber, req.body.uPassword], (err, result, fields) => {
        console.log(result)// + " " + req.body.uNumber + " " + req.body.uPassword);
        if (result.length > 0) {
            res.json({
                data: result
            })
        } else {
            res.json({
                data: "false"
            })
        }
    });
});

//User registration 
router.post('/Register', (req, res) => {
    const insQuery = "INSERT INTO users(`uName`, `uSurname`,`uDOB`,`uSex`,`uEmail`,`uNumber`,`uPassword`,`isActive`) VALUES (?, ?,?, ?, ?, ?,?,1)";
    const selectQuery = "SELECT * FROM users WHERE uNumber = ? AND uEmail = ?";
    const selectQuery1 = "SELECT * FROM users WHERE uNumber = ?";
    const selectQuery2 = "SELECT * FROM users WHERE uEmail = ?";

    //Check if number and email exists
    conn.query(selectQuery, [req.body.uNumber, req.body.uEmail], (err, result, fields) => {
        if (result.length > 0) {
            console.log(result);
            res.json({
                data: "both"
            });
        } else {
            //Check if number exists
            conn.query(selectQuery1, [req.body.uNumber], (err, result, fields) => {
                if (result.length > 0) {
                    res.json({
                        data: "number"
                    });
                } else {
                    //Check if email exists
                    conn.query(selectQuery2, [req.body.uEmail], (err, result, fields) => {
                        if (result.length > 0) {
                            res.json({
                                data: "email"
                            })
                        } else {
                            conn.query(insQuery, [req.body.uName, req.body.uSurname, req.body.uDOB, req.body.uSex, req.body.uEmail,
                            req.body.uNumber, req.body.uPassword], (err, result, fields) => {
                                console.log(err);
                                console.log(result);
                                res.json({
                                    data: "Registered"
                                })
                            });
                        };
                    });
                }
            });
        }
    });

});

module.exports = router;