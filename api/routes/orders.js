const express = require('express');
const router = express.Router();

const helperMethods = require('../../util/util');


//Returns all orders
router.get('/', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM `orders`", (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        res.json({
            shops: rows
        })

    });
});

//Returns all orders for a specific shop
router.get('/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM orders WHERE sID = ? AND (orders.oStatus = 'Waiting for order' OR orders.oStatus = 'Ready for collection')", req.params.sID, (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all past orders for a specific shop
router.get('/AdminPastOrders/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM orders WHERE sID = ? AND orders.oStatus = 'Collected'", req.params.sID, (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all passed orders for a specific shop
router.get('/shopPast/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =49)", [req.params.sID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all upcoming orders for a specific shop
router.get('/shopUpcoming/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =?)", [req.params.sID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Past orders for a specific user
router.get('/Past/:uID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM shops INNER JOIN orders ON orders.sID = shops.sID AND (orders.uID = ? AND (orders.oStatus = 'Collected' OR orders.oStatus = 'Cancelled')) ORDER BY orders.createdAt DESC", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Returns all Upcoming orders for a specific user
router.get('/Upcoming/:uID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM shops INNER JOIN orders ON shops.sID = orders.sID AND (orders.uID = ? AND orders.oStatus != 'Collected' AND orders.oStatus != 'Cancelled') ORDER BY orders.createdAt", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        if (rows.length > 0) {
            res.json({
                message: "orders",
                orders: rows
            })
        } else {
            res.json({
                message: "empty"
            })
        }
    });
});

//Place order
router.post('/Order', (req, res, next) => {

    const insQuery = "INSERT INTO orders(`oIngredients`, `oExtras`, `oPrice`, `oNumber`, `sID`, `uID`, `createdAt`) SELECT ?, ?, ?, COUNT(*)+1, ?, ?, '" + helperMethods.createdAt() + "' FROM orders WHERE DAY(orders.createdAt) = DAY(CURRENT_DATE) AND orders.sID = ?";
    helperMethods.conn().query(insQuery, [req.body.oIngredients, req.body.oExtras, req.body.oPrice, req.body.sID, req.body.uID, req.body.sID], (err, result, fields) => {
        console.log(err);
        if (!err) {
            console.log(result);
            const insertedID = result.insertId;
            const selQuery = "SELECT * FROM orders WHERE oID = " + insertedID;
            helperMethods.conn().query(selQuery, (err, result, fields) => {
                console.log(err);
                if (!err) {
                    console.log("new order");
                    console.log(result[0]);
                    //Prepare notification
                    const message = {
                        "token": "d7aQZEHUT1i49mbvsXXt8l:APA91bH7Js1Ul9bIoOT-TpMZ-V6QyDxLP04sD3PrUfMJS3GTFyrrYiCK6O7he_BpOpaN1tzEWsYIIviQ3jWBrRMr-V5bV00ZyrSdeUDBNjx_0_51uAUTAL8pgfyBeM_p2DbWNe9G_rTm",
                        "android": {
                            "notification": {
                                "title": "Order #13",
                                "body": "Ayispani lento"
                                //"click_action":"OPEN_ACTIVITY_1"
                            }
                        },

                        "data": {
                            "oNumber": "order: #" + result[0].oNumber,
                            "order": "R" + result[0].oPrice + " " + result[0].oIngredients
                        }
                    };

                    //Send notification
                    helperMethods.sendNotification(message, res.json({ data: insertedID }));
                }
            });
        }
    });
});

//Send order to shop
router.put('/Arrived/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oRecievedAt = '" + helperMethods.createdAt() + "', oStatus = 'Waiting for order' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "updated"
        })
    });
});

//Order Complete to shop
router.put('/Ready/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oFinishedAt = '" + helperMethods.createdAt() + "', oStatus = 'Ready for collection' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        const putQuery = "UPDATE shops SET sAveTime = (SELECT AVG(TIMEDIFF(TIME(orders.oFinishedAt) , TIME(orders.createdAt)))/60 AS sAveTime FROM orders WHERE orders.sID = 2) sID = 2";

        helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "updated"
            })
        });
    });
});

//Cancel order
router.put('/Cancel/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oColectedAt = '" + helperMethods.createdAt() + "', oStatus = 'Cancelled' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "Canceled"
        })
    });
});

//Collected order
router.put('/Collected/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oColectedAt = '" + helperMethods.createdAt() + "', oStatus = 'Collected' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "Canceled"
        })
    });
});

//Rate order
router.put('/Rate/:oID/:sID', (req, res, next) => {

    const putQuery = "UPDATE orders SET oRating = ?, oFeedback = ?, oColectedAt = '" + helperMethods.createdAt() + "' WHERE oID = ?";
    helperMethods.conn().query(putQuery, [req.body.oRating, req.body.oFeedback, req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        const putShopQuery = "UPDATE shops SET shops.sRating = (SELECT AVG(orders.oRating) FROM orders WHERE orders.sID = ? AND orders.oRating > 0) WHERE shops.sID = ?";
        helperMethods.conn().query(putShopQuery, [req.params.sID, req.params.sID], (err, result, fields) => {
            console.log(err);
            console.log(result);
            res.json({
                data: "saved"
            })
        });
    });
});

module.exports = router;