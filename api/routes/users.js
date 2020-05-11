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
    conn.query("SELECT * FROM users", (err, result, fields) => {
        res.json({
            users: result
        });
    });
});

//Change Password
router.get('/CheckPassword/:uID/:uPassword', (req, res, next) => {
    conn.query("SELECT * FROM users WHERE uID=? AND uPassword=?",[req.params.uID, req.params.uPassword], (err, rows, fields) => {
        if (rows.length > 0) {
            res.json({
                message:"true",
            })
        } else {
            res.json({
                message: "false"
            })
        }
    });
});

//Returns a specific user 
router.post('/Login', (req, res) => {
    const selectQuery = "SELECT * FROM `users` WHERE (`uNumber` = ? AND `uPassword` = ?)";
    conn.query(selectQuery, [req.body.uNumber, req.body.uPassword], (err, result, fields) => {
        console.log(result)
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

//New user registration 
router.post('/Register', (req, res) => {
    const insQuery = "INSERT INTO users(`uName`, `uSurname`,`uDOB`,`uSex`,`uEmail`,`uNumber`,`uPassword`,`isActive`) VALUES (?, ?,?, ?, ?, ?,?,1)";
    const selectQuery = "SELECT * FROM users WHERE uNumber = ? AND uEmail = ?";
    const selectQuery1 = "SELECT * FROM users WHERE uNumber = ?";
    const selectQuery2 = "SELECT * FROM users WHERE uEmail = ?";

    //Check if number and email exists then register 
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
                                //console.log(err);
                                console.log(result.insertId);
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

//Update user Number
router.put('/EditNumber', (req, res, next) => {
    const updateQuery = "UPDATE users SET uNumber = ? WHERE uID = ?";
    const selectQuery = "SELECT * FROM users WHERE uNumber = ?";

    //Check if number exists
    var number = req.body.uNumber;
    var uID = req.body.uID;
    conn.query(selectQuery, [number], (err, result, fields) => {
        //console.log(err);
        //console.log(result);
        if (result.length > 0) {
            res.json({
                data: "number"
            });
        } else {
            conn.query(updateQuery, [number, uID], (err, result, fields) => {
                console.log(uID);
                console.log(result);
                const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
                console.log(uID);
                conn.query(selectQuery, [uID], (err, result, fields) => {
                    //console.log(err);
                   // console.log(result);
                    res.json({
                        data: "saved",
                        response: result
                    })
                });
            });
        }
    });
});

//Update user Email
router.put('/EditEmail', (req, res, next) => {
    const updateQuery = "UPDATE users SET uEmail = ? WHERE uID = ?";
    const selectQuery = "SELECT * FROM users WHERE uEmail = ?";

    //Check if email exists
    var email = req.body.uEmail;
    var uID = req.body.uID;
    conn.query(selectQuery, [email], (err, result, fields) => {
        //console.log(err);
        //console.log(result);
        if (result.length > 0) {
            res.json({
                data: "email"
            });
        } else {
            conn.query(updateQuery, [email, uID], (err, result, fields) => {
                console.log(uID);
                console.log(result);
                const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
                console.log(uID);
                conn.query(selectQuery, [uID], (err, result, fields) => {
                    //console.log(err);
                   // console.log(result);
                    res.json({
                        data: "saved",
                        response: result
                    })
                });
            });
        }
    });
});

//Update user information
router.put('/EditProfile', (req, res, next) => {
    const updateQuery = "UPDATE users SET uName = ?, uSurname = ?, uDOB = ?, uSex = ? WHERE uID = ?";

    //Check if number and email exists then register 
    conn.query(updateQuery, [req.body.uName, req.body.uSurname, req.body.uDOB, req.body.uSex, req.body.uID], (err, result, fields) => {
        //console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.body.uID;
        console.log(uID);
        conn.query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});

//Update user information
router.put('/ChangePassword/:uID', (req, res, next) => {
    const updateQuery = "UPDATE users SET uPassword = ? WHERE uID = ?";

    //Check if number and email exists then register 
    conn.query(updateQuery, [req.body.uPassword, req.params.uID], (err, result, fields) => {
        //console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.params.uID;
        console.log(uID);
        conn.query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});

module.exports = router;