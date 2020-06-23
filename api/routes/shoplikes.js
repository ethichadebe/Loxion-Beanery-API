const helperMethods = require('../../util/util');

helperMethods.router().post('/', (req, res, next) => {
    const insQuery = "INSERT INTO shoplikes(sID, uID) VALUES (?,?);";

    helperMethods.conn().query(insQuery, [req.body.sID, req.body.uID, req.body.sID], (err, result, fields) => {
        if (err == null) {
            var sID = req.body.sID;
            const upQuery = "UPDATE shops SET shops.sLikes = (SELECT COUNT(*) FROM shoplikes WHERE shoplikes.sID = ?) WHERE shops.sID=?;";
            console.log(err);
            console.log(result);
            helperMethods.conn().query(upQuery, [sID, sID], (err, result, fields) => {
                console.log(err);
                console.log(result);
                helperMethods.conn().query("SELECT COUNT(*) AS sLikes FROM `shoplikes` WHERE sID = ?", [sID], (err, rows, fields) => {
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

helperMethods.router().delete('/:uID/:sID', (req, res, next) => {
    const delQuery = "DELETE FROM `shoplikes` WHERE `sID` = ? AND `uID` = ?;";

    helperMethods.conn().query(delQuery, [req.params.sID, req.params.uID, req.params.sID], (err, result, fields) => {
        if (err == null) {
            var sID = req.params.sID;
            const upQuery = "UPDATE shops SET shops.sLikes = (SELECT COUNT(*) FROM shoplikes WHERE shoplikes.sID = ?) WHERE shops.sID=?;";
            console.log(err);
            console.log(result);
            helperMethods.conn().query(upQuery, [sID, sID], (err, result, fields) => {
                console.log(err);
                console.log(result);
                helperMethods.conn().query("SELECT COUNT(*) AS sLikes FROM `shoplikes` WHERE sID = ?", [sID], (err, rows, fields) => {
                    console.log(err);
                    console.log(rows[0].sLikes);
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

module.exports = helperMethods.router();