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
        res.json(rows);
    });
});

router.post('/Register', (req, res) => {
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

module.exports = router;