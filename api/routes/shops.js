const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));

//Database connection
const conn = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7339875',
    password: 'tcyCE9lpMR',
    database: 'sql7339875',
    port: '3306'
});


function addZero(data) {
    if (data.length < 2) {
        return "0" + data;
    }
    return data;
}

function createdAt() {
    var currentdate = new Date();
    return currentdate.getFullYear() + "-"
        + addZero("" + (currentdate.getMonth() + 1)) + "-"
        + addZero("" + currentdate.getDate()) + " "
        + addZero("" + currentdate.getHours()) + ":"
        + addZero("" + currentdate.getMinutes()) + ":"
        + addZero("" + currentdate.getSeconds());

}

function logOutput(err, result) {
    if (err != null) {
        console.log(err)
    }
}

//Returns all shops
router.get('/:uID', (req, res, next) => {
    conn.query("SELECT shops.*, (SELECT COUNT(*) FROM shoplikes WHERE shoplikes.uID = ? AND (shoplikes.sID = shops.sID)) AS isLiked, (SELECT SQRT(((shops.sLatitude ?)*(shops.sLatitude - ?)) + ((shops.sLongitude - ?)*(shops.sLongitude - ?)))) AS distance FROM shops WHERE shops.isActive = 1 ORDER BY shops.sStatus DESC, distance ASC", [req.params.uID, req.params.sLat, req.params.sLat, req.params.sLong, req.params.sLong], (err, rows, fields) => {
        console.log(err);
//        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "shops",
                shops: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all shops owned by user
router.get('/MyShops/:uID', (req, res, next) => {
    conn.query("SELECT shops.*, usershopbridge.uRole, (SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders FROM shops, usershopbridge WHERE (shops.sID = usershopbridge.sID) AND (usershopbridge.uID = ?) AND (shops.isActive != 2) ORDER BY shops.sStatus DESC", [req.params.uID], (err, rows, fields) => {//WHERE uID=?", 
    console.log(err);
//    console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "shops",
                shops: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Menuitems for each shop
router.get('/MenuItems/:sID', (req, res, next) => {
    conn.query("SELECT * FROM `menuitems` WHERE sID = ? ORDER BY `mPrice` ASC", req.params.sID, (err, rows, fields) => {
        console.log(err);
        //console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "shops",
                menuItems: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Ingredients for each shop
router.get('/Ingredients/:sID', (req, res, next) => {
    conn.query("SELECT ingredients.*, (SELECT COUNT(*) FROM `extras` WHERE sID = ?) AS nExtras FROM `ingredients` WHERE sID = ?", [req.params.sID, req.params.sID], (err, rows, fields) => {
        console.log(err);
       // console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "shops",
                ingredients: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Extras for each shop
router.get('/Extras/:sID', (req, res, next) => {
    conn.query("SELECT * FROM `extras` WHERE sID = ?", [req.params.sID], (err, rows, fields) => {
        console.log(err);
        //  console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "shops",
                extras: rows
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
    const insQuery = "INSERT INTO shops(`sName`,`sShortDescrption`,`sFullDescription`, `sSmallPicture`, `sBigPicture`, `sLocation`,`sRating`,`sStatus`,`sLikes`,`sOperatingHrs`,`isActive`,`createdAt`) VALUES (?, ?,?, ?,?, ?, 0.0, 0,0,?,0, '" + createdAt() + "')";

    conn.query(insQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
    req.body.sSmallPicture, req.body.sBigPicture, req.body.sLocation, req.body.sOperatingHrs], (err, result, fields) => {
        console.log(err);
        //console.log(result);
        var sID = result.insertId;
        const insQuery1 = "INSERT INTO usershopbridge(`uID`,`sID`,`uRole`, `createdAt`) VALUES (?, " + sID + ", 'Owner', '" + createdAt() + "')";
        conn.query(insQuery1, [req.body.uID], (err, result, fields) => {
            console.log(err);
            //console.log(result);
            res.json({
                data: sID
            })
        });
    });
});

//Register shop Ingredients
router.post('/Register/Ingredient', (req, res, next) => {
    const insQuery = "INSERT INTO ingredients(`iName`,`iPrice`,`sID`,`isActive`,`createdAt`) VALUES (?, ?, ?, 1, '" + createdAt() + "')";

    conn.query(insQuery, [req.body.iName, req.body.iPrice, req.body.sID], (err, result, fields) => {
        const selQuery = "SELECT * FROM `ingredients` WHERE iID = ?";
        console.log(req.body.iPrice);

        conn.query(selQuery, result.insertId, (err, result, fields) => {
            console.log(err);
            //console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });
});

//Register shop Menu items
router.post('/Register/MenuItem', (req, res, next) => {
    const insQuery = "INSERT INTO `menuitems` (`mList`, `mPrice`, `isActive`, `sID`, `createdAt`) VALUES (?, ?, '0', ?, '" + createdAt() + "')";
    const checkQuesry = "SELECT COUNT(menuitems.sID) AS nItems FROM menuitems WHERE menuitems.sID = ?";
    const ActivateQuery = "UPDATE `shops` SET `isActive` = '1' WHERE `shops`.`sID` = ?;";
    const selQuery = "SELECT * FROM `menuitems` WHERE mID = ?";
    conn.query(insQuery, [req.body.mList, req.body.mPrice, req.body.sID], (err, result, fields) => {
        console.log(err);
//        console.log(result);
        var ID = result.insertId;
        conn.query(checkQuesry, [req.body.sID], (err, result, fields) => {
//            console.log(result);
            console.log(err);
            console.log(result[0].nItems);
            if (result[0].nItems == 1) {
                conn.query(ActivateQuery, req.body.sID, (err, result, fields) => {
                    console.log(err);
                    console.log("isActive activated");
                    //console.log(result);
                    conn.query(selQuery, ID, (err, result, fields) => {
                        console.log(err);
                        //console.log(result);
                        res.json({
                            data: "saved",
                            response: result
                        })
                    });
                });

            } else {
                conn.query(selQuery, ID, (err, result, fields) => {
                    console.log("else");
                    console.log(err);
                    //console.log(result);
                    res.json({
                        data: "saved",
                        response: result
                    })
                });

            }

        });
    });
});

//Register shop Extras
router.post('/Register/Extra', (req, res, next) => {
    const insQuery = "INSERT INTO extras(`eName`,`isActive`,`sID`,`createdAt`) VALUES (?, 1,?, '" + createdAt() + "')";

    conn.query(insQuery, [req.body.eName, req.body.sID], (err, result, fields) => {
        const selQuery = "SELECT * FROM `extras` WHERE eID = ?";

        conn.query(selQuery, result.insertId, (err, result, fields) => {
            console.log(err);
            //console.log(result);
            res.json({
                data: "saved",
                response: result
            })
        });
    });
});

//Delete shop Ingredients
router.delete('/Register/Ingredient/:iID', (req, res, next) => {
    const delQuery = "DELETE FROM `ingredients` WHERE `ingredients`.`iID` = ?";

    conn.query(delQuery, [req.params.iID], (err, result, fields) => {
        console.log(err);
        //console.log(result);
        res.json({
            data: "removed"
        })
    });
});

//Delete shop Menu items
router.delete('/Register/MenuItem/:mID/:sID', (req, res, next) => {
    const delQuery = "DELETE FROM `menuitems` WHERE `menuitems`.`mID` = ?";
    const DeactivateQuery = "UPDATE `shops` SET `isActive` = '0' WHERE `shops`.`sID` = ?;";
    const checkQuesry = "SELECT COUNT(menuitems.sID) AS nItems FROM menuitems WHERE menuitems.sID = ?";

    var sID = req.params.sID;
    conn.query(delQuery, [req.params.mID], (err, result, fields) => {
        console.log(err);
//        console.log(result);
        if (result == undefined) {
            res.err("something went wrong please try again")
        } else {
            conn.query(checkQuesry, [sID], (err, result, fields) => {
             //   console.log(result);
                console.log(err);
                console.log(result[0].nItems);
                if (result[0].nItems == 0) {
                    conn.query(DeactivateQuery, [sID], (err, result, fields) => {
                        console.log(sID);
                        console.log(err);
                        console.log("isActive deactivated");
                        //console.log(result);
                        res.json({
                            data: "removed",
                            response: result
                        })
                    });

                } else {
                    res.json({
                        data: "removed",
                        response: result
                    })
                }
            });
        }
    });
});

//Delete shop Extras
router.delete('/Register/Extra/:eID', (req, res, next) => {
    const delQuery = "DELETE FROM `extras` WHERE `extras`.`eID` = ?";

    conn.query(delQuery, [req.body.eID], (err, result, fields) => {
        console.log(err);
      //  console.log(result);
        res.json({
            data: "removed"
        })
    });
});

//Put shop
router.put('/Register/:sID', (req, res, next) => {
    const putQuery = "UPDATE shops SET `sName` = ?,`sShortDescrption` = ?,`sFullDescription` = ?, `sSmallPicture` = ?, `sBigPicture` = ?, `sLocation` = ?,`sOperatingHrs` = ? WHERE sID = ?";

    conn.query(putQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
    req.body.sSmallPicture, req.body.sBigPicture, req.body.sLocation, req.body.sOperatingHrs, req.params.sID], (err, result, fields) => {
        console.log(err);
        //console.log(result);
        res.json({
            data: "changed"
        })
    });
});

//Put shop Ingredients
router.put('/Register/Ingredient/:iID', (req, res, next) => {
    const putQuery = "UPDATE ingredients SET iName = ?, iPrice = ? WHERE iID = ?";

    conn.query(putQuery, [req.body.iName, req.body.iPrice, req.params.iID], (err, result, fields) => {
        console.log(err);
        //console.log(result);
        res.json({
            data: "changed"
        })
    });
});

//Put shop Menu items
router.put('/Register/MenuItems/:mID', (req, res, next) => {
    const putQuery = "UPDATE menuitems SET mList = ?, mPrice = ? WHERE mID = ?";

    conn.query(putQuery, [req.body.mList, req.body.mPrice, req.params.mID], (err, result, fields) => {
        console.log(err);
       // console.log(result);
        res.json({
            data: "changed"
        })
    });
});

//Put shop Extras
router.put('/Register/Extra/:eID', (req, res, next) => {
    const putQuery = "UPDATE extras SET eName = ? WHERE eID = ?";

    conn.query(putQuery, [req.body.eName, req.params.eID], (err, result, fields) => {
        console.log(err);
       // console.log(result);
        res.json({
            data: "saved"
        })
    });
});

//Put shop Status
router.put('/Status/:sID', (req, res, next) => {
    const putQuery = "UPDATE shops SET sStatus = ? WHERE sID = ?";

    conn.query(putQuery, [req.body.sStatus, req.params.sID], (err, result, fields) => {
        console.log(err);
        //console.log(result);
        res.json({
            data: "saved"
        })
    });
});

//Deactivate Shop
router.put('/deactivate/:sID', (req, res, next) => {
    const putQuery = "UPDATE shops SET isActive = 2 WHERE sID = ?";

    conn.query(putQuery, [req.params.sID], (err, result, fields) => {
        console.log(err);
       // console.log(result);
        res.json({
            data: "deactivated"
        })
    });
});

module.exports = router;