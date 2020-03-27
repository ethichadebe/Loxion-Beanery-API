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
    conn.query("SELECT * FROM shops", (err, rows, fields) => {
        res.json({
            shops: rows
        });
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
    const insQuery = "INSERT INTO ingredients(`iName`,`iPrice`,`sID`,'isActive') VALUES (?, ?, ?, 1)";

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
    const insQuery = "INSERT INTO ingredients(`mList`,`mPrice`,`sID`,'isActive') VALUES (?, ?, ?, 1)";

    conn.query(insQuery, [req.body.mList, req.body.mPrice, req.body.sID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "saved"
        })
    });
});

module.exports = router;