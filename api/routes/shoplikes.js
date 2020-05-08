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

router.post('/', (req, res, next) => {
    const insQuery = "INSERT INTO shoplikes(sID, uID) VALUES (?,?);";

    conn.query(insQuery, [req.body.sID, req.body.uID, req.body.sID], (err, result, fields) => {
        if (err == null) {
            var sID = req.body.sID;
            const upQuery = "UPDATE shops SET shops.sLikes = (SELECT COUNT(shoplikes.sID) FROM shoplikes WHERE shoplikes.sID = ?) WHERE shops.sID=?;";
            conn.query(upQuery, [sID, sID], (err, result, fields) => {
                console.log(err);
                //console.log(result);
                conn.query("SELECT COUNT(*) AS sLikes FROM `shoplikes` WHERE sID = ?", [sID], (err, rows, fields) => {
                    console.log(err);
                    console.log(rows[0].sLikes);
                    res.json({
                        message: "saved",
                        likes: rows[0].sLikes
                    })
                });
            });

        } else {
            console.log(err);
        }
    });
});

router.delete('/:uID/:sID', (req, res, next) => {
    const delQuery = "DELETE FROM `shoplikes` WHERE `sID` = ? AND `uID` = ?;";

    conn.query(delQuery, [req.params.sID, req.params.uID, req.params.sID], (err, result, fields) => {
        if (err == null) {
            var sID = req.body.sID;
            const upQuery = "UPDATE shops SET shops.sLikes = (SELECT COUNT(shoplikes.sID) FROM shoplikes WHERE shoplikes.sID = ?) WHERE shops.sID=?;";
            conn.query(upQuery, [sID, sID], (err, result, fields) => {
                console.log(err);
                //console.log(result);
                conn.query("SELECT COUNT(*) AS sLikes FROM `shoplikes` WHERE sID = ?", [sID], (err, rows, fields) => {
                    console.log(err);
                    console.log(rows);
                    res.json({
                        message: "removed",
                        likes: rows[0].sLikes
                    })
                });
            });

        } else {
            console.log(err);
        }
    });
});


module.exports = router;