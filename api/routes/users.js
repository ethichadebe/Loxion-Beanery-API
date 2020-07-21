const helperMethods = require('../../util/util');

//Returns all users
helperMethods.router().get('/', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM users", (err, result, fields) => {
        console.log(err)
        console.log(result)
        res.json({
            users: result
        });
    });
});

//Change Password
helperMethods.router().get('/CheckPassword/:uID/:uPassword', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM users WHERE uID=? AND uPassword=?", [req.params.uID, req.params.uPassword], (err, rows, fields) => {
        if (rows.length > 0) {
            res.json({
                message: "true",
            })
        } else {
            res.json({
                message: "false"
            })
        }
    });
});

//Returns a specific user 
helperMethods.router().post('/Login', (req, res) => {
    const selectQuery = "SELECT * FROM `users` WHERE (`uNumber` = ? AND `uPassword` = ?)";
    helperMethods.conn().query(selectQuery, [req.body.uNumber, req.body.uPassword], (err, result, fields) => {
        console.log(err)
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
helperMethods.router().post('/Register', (req, res, next) => {
    console.log(req.file);
    const insQuery = "INSERT INTO users(`uName`, `uSurname`,`uAddress`,`uLongitude`,`uLatitude`,`uSex`,`uEmail`,`uNumber`,`uPassword`,`uType`,`isActive`, `uCreatedAt`) VALUES (?, ?,?, ?,?,?, ?, ?,?,?,1, '" + helperMethods.createdAt() + "')";

    helperMethods.conn().query(insQuery, [req.body.uName, req.body.uSurname, req.body.uAddress,
    req.body.uLongitude, req.body.uLatitude, req.body.uSex, req.body.uEmail, req.body.uNumber,
    req.body.uPassword, req.body.uType], (err, result, fields) => {
        console.log(err);
        console.log(result.insertId);
        res.json({
            uID: result.insertId,
            data: "Registered"
        })
    });
});

//Check if password and email exist
helperMethods.router().post('/CheckStuff', (req, res) => {
    const selectQuery = "SELECT * FROM users WHERE uNumber = ? AND uEmail = ?";
    const selectQuery1 = "SELECT * FROM users WHERE uNumber = ?";
    const selectQuery2 = "SELECT * FROM users WHERE uEmail = ?";

    console.log("Database connected successfully!");
    //Check if number and email exists then register 
    helperMethods.conn().query(selectQuery, [req.body.uNumber, req.body.uEmail], (err, result, fields) => {

        if (result.length > 0) {
            console.log(err);
            console.log(result);
            res.json({
                data: "both"
            });
        } else {
            //Check if number exists
            helperMethods.conn().query(selectQuery1, [req.body.uNumber], (err, result, fields) => {
                if (result.length > 0) {
                    res.json({
                        data: "number"
                    });
                } else {
                    //Check if email exists
                    helperMethods.conn().query(selectQuery2, [req.body.uEmail], (err, result, fields) => {
                        if (result.length > 0) {
                            res.json({
                                data: "email"
                            })
                        } else {
                            res.json({
                                data: "Registered"
                            })
                        };
                    });
                }
            });
        }
    });

});

//Update user Number
helperMethods.router().put('/EditNumber', (req, res, next) => {
    const updateQuery = "UPDATE users SET uNumber = ? WHERE uID = ?";
    const selectQuery = "SELECT * FROM users WHERE uNumber = ?";

    //Check if number exists
    var number = req.body.uNumber;
    var uID = req.body.uID;
    helperMethods.conn().query(selectQuery, [number], (err, result, fields) => {
        console.log(err);
        console.log(result);
        if (result.length > 0) {
            res.json({
                data: "number"
            });
        } else {
            helperMethods.conn().query(updateQuery, [number, uID], (err, result, fields) => {
                console.log(uID);
                console.log(err);
                console.log(result);
                const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
                console.log(uID);
                helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
                    console.log(err);
                    console.log(result);
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
helperMethods.router().put('/EditEmail', (req, res, next) => {
    const updateQuery = "UPDATE users SET uEmail = ? WHERE uID = ?";
    const selectQuery = "SELECT * FROM users WHERE uEmail = ?";

    //Check if email exists
    var email = req.body.uEmail;
    var uID = req.body.uID;
    helperMethods.conn().query(selectQuery, [email], (err, result, fields) => {
        console.log(err);
        console.log(result);
        if (result.length > 0) {
            res.json({
                data: "email"
            });
        } else {
            helperMethods.conn().query(updateQuery, [email, uID], (err, result, fields) => {
                console.log(uID);
                console.log(err);
                console.log(result);
                const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
                console.log(uID);
                helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
                    console.log(err);
                    console.log(result);
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
helperMethods.router().put('/EditProfile', helperMethods.upload().single('ProfilePicture'), (req, res, next) => {
    console.log(req.file);
    const updateQuery = "UPDATE users SET uName = ?, uSurname = ?, uAddress = ?, uLongitude = ?, uLatitude = ?, uSex = ?, uPicture = '" + req.file.location + "' WHERE uID = ?";

    //Check if number and email exists then register 
    helperMethods.conn().query(updateQuery, [req.body.uName, req.body.uSurname, req.body.uAddress,
    req.body.uLongitude, req.body.uLatitude, req.body.uSex, req.body.uID], (err, result, fields) => {
        console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.body.uID;
        console.log(uID);
        helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});

//Update user location
helperMethods.router().put('/EditLocation', (req, res, next) => {
    console.log(req.file);
    const updateQuery = "UPDATE users SET uAddress = ?, uLongitude = ?, uLatitude = ? WHERE uID = ?";

    //Check if number and email exists then register 
    helperMethods.conn().query(updateQuery, [req.body.uAddress, req.body.uLongitude, req.body.uLatitude, req.body.uID], (err, result, fields) => {
        console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.body.uID;
        console.log(uID);
        helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});

//Update user profile picture
helperMethods.router().put('/EditProfilePicture', helperMethods.upload().single('ProfilePicture'), (req, res, next) => {
    console.log(req.file);
    const updateQuery = "UPDATE users SET uPicture = '" + req.file.location + "' WHERE uID = ?";

    //Check if number and email exists then register 
    helperMethods.conn().query(updateQuery, [req.body.uID], (err, result, fields) => {
        console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.body.uID;
        console.log(uID);
        helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});

//Update user password
helperMethods.router().put('/ChangePassword/:uID', (req, res, next) => {
    const updateQuery = "UPDATE users SET uPassword = ? WHERE uID = ?";

    //Check if number and email exists then register 
    helperMethods.conn().query(updateQuery, [req.body.uPassword, req.params.uID], (err, result, fields) => {
        console.log(err);
        const selectQuery = "SELECT * FROM `users` WHERE  `uID` = ?";
        var uID = req.params.uID;
        console.log(uID);
        helperMethods.conn().query(selectQuery, [uID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });

});
module.exports = helperMethods.router();