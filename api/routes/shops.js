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

//Returns all shops
router.get('/', (req, res, next) => {
    var shopDetails = [];
    var ingredients = [];
    var menuList = [];
    conn.query("SELECT * FROM shops", (err, rows, fields) => {
        shopDetails = rows;
        for (var i = 0; i < rows.length; i++) {
            var shop = shopDetails[i];
            var id = shopDetails[i].sID;
            console.log(id);
            conn.query("SELECT * FROM menuitems WHERE sID = ?", id, (err, rows, fields) => {
                ingredients = rows;
                console.log(ingredients);

                conn.query("SELECT * FROM ingredients WHERE sID = ?", id, (err, rows, fields) => {
                    menuList = rows
                    console.log(menuList);

                    res.json({
                        data : shop,
                        ingredients: ingredients,
                        menuList:menuList
                    });
                });
            });
        }
    });
});

//Register shop
router.post('/Register', (req, res, next) => {
    const insQuery = "INSERT INTO shops(`sName`,`sShortDescrption`,`sFullDescription`, `sSmallPicture`, `sBigPicture`, `sLocation`,`sRating`,`sOperatingHrs`,`isActive`) VALUES (?, ?,?, ?,?, ?, 0.0,?,0)";

    conn.query(insQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
    req.body.sSmallPicture, req.body.sBigPicture, req.body.sLocation, req.body.sOperatingHrs], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: result.insertId
        })
    });
});

//Register shop Ingredients
router.post('/Register/Ingredient', (req, res, next) => {
    const insQuery = "INSERT INTO ingredients(`iName`,`iPrice`,`sID`,`isActive`) VALUES (?, ?, ?, 1)";

    conn.query(insQuery, [req.body.iName, req.body.iPrice, req.body.sID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "saved"
        })
    });
});

//Register shop Menu items
router.post('/Register/MenuItem', (req, res, next) => {
    const insQuery = "INSERT INTO menuitems(`mList`,`mPrice`,`isActive`,`sID`) VALUES (?, ?, 1, ?)";

    conn.query(insQuery, [req.body.mList, req.body.mPrice, req.body.sID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "saved"
        })
    });
});

//Register shop Extras
router.post('/Register/Extra', (req, res, next) => {
    const insQuery = "INSERT INTO extras(`eName`,`isActive`,`sID`) VALUES (?, 1,?)";

    conn.query(insQuery, [req.body.eName, req.body.sID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "saved"
        })
    });
});

module.exports = router;