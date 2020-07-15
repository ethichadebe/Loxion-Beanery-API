const helperMethods = require('../../util/util');

//Place order
helperMethods.router().post('/Order', (req, res, next) => {
    const insQuery = "INSERT INTO orders(`oIngredients`, `oExtras`, `oPrice`, `oNumber`, `sID`, `uID`, `oCreatedAt`) SELECT ?, ?, ?, COUNT(*)+1, ?, ?, '" + helperMethods.createdAt() + "' FROM orders WHERE DAY(orders.oCreatedAt) = DAY(CURRENT_DATE) AND orders.sID = ?";
    helperMethods.conn().query(insQuery, [req.body.oIngredients, req.body.oExtras, req.body.oPrice, req.body.sID, req.body.uID, req.body.sID], (err, result, fields) => {
        console.log(err);
        if (!err) {

            console.log("Inserted record: ", result);
            const insertedID = result.insertId;
            const selQuery = "SELECT shops.*,(SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders, orders.* FROM shops INNER JOIN orders ON shops.sID = orders.sID AND orders.oID = ?";
            helperMethods.conn().query(selQuery, insertedID, (err, result, fields) => {
                console.log(err);
                if (!err) {
                    console.log("new order");
                    console.log(result[0]);
                    //Prepare notification
                    //TODO: set topic to anyone subscribed to the shop ID
                    /* const message = {
                         "topic": "" + result[0].sReceiver,
                         "android": {
                             "notification": {
                                 "title": "" + result[0].oNumber,
                                 "body": "R" + result[0].oPrice + " " + result[0].oIngredients,
                                 "click_action": "OrdersActivity"
                             }
                         },
 
                         "data": {
                             "sID": "" + result[0].sID,
                             "sName": "" + result[0].sName,
                             "sSmallPicture": "" + result[0].sSmallPicture,
                             "sBigPicture": "" + result[0].sBigPicture,
                             "sShortDescrption": "" + result[0].sShortDescrption,
                             "sFullDescrption": "" + result[0].sFullDescrption,
                             "sLatitude": "" + result[0].sLatitude,
                             "sLongitude": "" + result[0].sLongitude,
                             "oID": "" + result[0].oAddress,
                             "sAveTime": "" + result[0].sAveTime,
                             "sOperatingHrs": "" + result[0].sOperatingHrs,
                             "isActive": "" + result[0].isActive,
                             "sStatus": "" + result[0].sStatus,
                             "oID": "" + result[0].oID
                         }
                     };
 
                     //Send notification
                     helperMethods.sendNotification(message, );*/
                    res.json(result[0]);
                }
            });
        }
    });
});

//Returns all orders
helperMethods.router().get('/', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM `orders`", (err, rows, fields) => {
        console.log(err);
        console.log(rows);
        res.json({
            shops: rows
        })

    });
});

//Returns all orders for a specific shop
helperMethods.router().get('/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM orders WHERE sID = ? AND (orders.oStatus = 'Waiting for order' OR orders.oStatus = 'Ready for collection')", req.params.sID, (err, rows, fields) => {
        console.log(err);
        //console.log(rows);
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
helperMethods.router().get('/AdminPastOrders/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM orders WHERE sID = ? AND orders.oStatus = 'Collected'", req.params.sID, (err, rows, fields) => {
        console.log(err);
        //        console.log(rows);
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
helperMethods.router().get('/shopPast/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =49)", [req.params.sID], (err, rows, fields) => {
        console.log(err);
        // console.log(rows);
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
helperMethods.router().get('/shopUpcoming/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT orders.*, shops.sName FROM orders, shops WHERE (orders.sID = shops.sID) AND (orders.uID =?)", [req.params.sID], (err, rows, fields) => {
        console.log(err);
        // console.log(rows);
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
helperMethods.router().get('/Past/:uID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM shops INNER JOIN orders ON orders.sID = shops.sID AND (orders.uID = ? AND (orders.oStatus = 'Collected' OR orders.oStatus = 'Cancelled')) ORDER BY orders.oCreatedAt DESC", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        //   console.log(rows);
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
helperMethods.router().get('/Upcoming/:uID', (req, res, next) => {
    helperMethods.conn().query("SELECT * FROM shops INNER JOIN orders ON shops.sID = orders.sID AND (orders.uID = ? AND orders.oStatus != 'Collected' AND orders.oStatus != 'Cancelled') ORDER BY orders.oCreatedAt", [req.params.uID], (err, rows, fields) => {
        console.log(err);
        // console.log(rows)
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

//Send order to shop
helperMethods.router().put('/Arrived/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oRecievedAt = '" + helperMethods.createdAt() + "', oStatus = 'Waiting for order' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        const selQuery = "SELECT shops.*,(SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders, orders.* FROM shops INNER JOIN orders ON shops.sID = orders.sID AND orders.oID = ?";
        helperMethods.conn().query(selQuery, req.params.oID, (err, result, fields) => {
            console.log(err);
            if (!err) {
                console.log("new order");
                console.log(result[0]);
                //Prepare notification
                //TODO: set topic to anyone subscribed to the shop ID
                const message = {
                    "topic": "" + result[0].sReceiver,
                    "android": {
                        "notification": {
                            "title": "Order #" + result[0].oNumber,
                            "body": "R" + result[0].oPrice + " " + result[0].oIngredients,
                            "click_action": "OrdersActivity",
                            "channel_id": "incoming_order",
                            "tag": "" + result[0].oNumber,
                            "notification_priority": "PRIORITY_HIGH",
                            "visibility": "PUBLIC",
                            "color": "#C45A26",
                        }
                    },

                    "data": {
                        "sID": "" + result[0].sID,
                        "sName": "" + result[0].sName,
                        "sSmallPicture": "" + result[0].sSmallPicture,
                        "sBigPicture": "" + result[0].sBigPicture,
                        "sShortDescrption": "" + result[0].sShortDescrption,
                        "sFullDescription": "" + result[0].sFullDescription,
                        "sLatitude": "" + result[0].sLatitude,
                        "sLongitude": "" + result[0].sLongitude,
                        "sAddress": "" + result[0].sAddress,
                        "sAveTime": "" + result[0].sAveTime,
                        "sOperatingHrs": "" + result[0].sOperatingHrs,
                        "isActive": "" + result[0].isActive,
                        "oID": "" + result[0].oID,
                        "isPast": "false",
                        "sStatus": "" + result[0].sStatus
                    }
                };

                //Send notification
                helperMethods.sendNotification(message, res.json({ data: "updated" }));
            }
        });
    });
});

//Order Complete to shop
helperMethods.router().put('/Ready/:oID/:sID', (req, res, next) => {
    //Set order status to collected
    const putQuery = "UPDATE orders SET oFinishedAt = '" + helperMethods.createdAt() + "', oStatus = 'Ready for collection' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        if (!err) {
            console.log(result);
            //Update shop average preparation time
            const putQuery = "UPDATE shops SET sAveTime = (SELECT AVG(TIMEDIFF(TIME(orders.oFinishedAt) , TIME(orders.oCreatedAt)))/60 AS sAveTime FROM orders WHERE orders.sID = ?)";

            helperMethods.conn().query(putQuery, [req.params.sID], (err, result, fields) => {
                console.log(err);
                if (!err) {
                    const selQuery = "SELECT shops.*,(SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders, orders.* FROM shops INNER JOIN orders ON shops.sID = orders.sID AND orders.oID = ?";

                    helperMethods.conn().query(selQuery, [req.params.oID], (err, result, fields) => {
                        console.log(err);
                        if (!err) {
                            console.log("new order");
                            console.log(result[0]);
                            //Prepare notification
                            const message = {
                                "topic": "" + result[0].uID,
                                "android": {
                                    "notification": {
                                        "title": "Order #" + result[0].oNumber,
                                        "body": "Your order is ready for collection",
                                        "click_action": "MainActivity",
                                        "channel_id": "ready_for_collection",
                                        "tag": "" + result[0].oNumber,
                                        "notification_priority": "PRIORITY_HIGH",
                                        "visibility": "PUBLIC",
                                        "color": "#C45A26",
                                    }
                                },

                                "data": {
                                    "oID": "" + result[0].oID,
                                    "oIngredients": result[0].oIngredients,
                                    "oExtras": result[0].oExtras,
                                    "oPrice": "" + result[0].oPrice,
                                    "oNumber": "" + result[0].oNumber,
                                    "sID": "" + result[0].sID,
                                    "uID": "" + result[0].uID,
                                }
                            };

                            //Send notification
                            helperMethods.sendNotification(message, res.json({ data: "Ready for collection" }));
                        }
                    });
                }
            });
        }
    });
});

//Cancel order
helperMethods.router().put('/Cancel/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oCollectedAt = '" + helperMethods.createdAt() + "', oStatus = 'Cancelled' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        if (!err) {
            console.log(result);
            //Prepare notification
            const message = {
                "topic": req.params.oID,
                "android": {
                    "notification": {
                        "title": "Order #" + req.params.oID + " cancelled",
                        "body": "Your order has been cancelled. \nMore Information: " + req.body.feedback,
                        "click_action": "LoginActivity",
                        "channel_id": "order_cancelled",
                        "tag": "" + req.params.sID,
                        "notification_priority": "PRIORITY_HIGH",
                        "visibility": "PUBLIC",
                        "color": "#C45A26",
                    }
                },

                "data": {
                    "sID": "" + req.params.sID,
                    "topic": "" + req.body.sName.replace(/[^a-zA-Z0-9]/g, '_') + req.params.sID
                }
            };

            helperMethods.sendNotification(message, res.json({ data: "cancelled" }));
        } else {
            console.log(err);
        }
    });
});

//Collected order
helperMethods.router().put('/Collected/:oID', (req, res, next) => {
    const putQuery = "UPDATE orders SET oCollectedAt = '" + helperMethods.createdAt() + "', oStatus = 'Collected' WHERE oID = ?";

    helperMethods.conn().query(putQuery, [req.params.oID], (err, result, fields) => {
        console.log(err);
        console.log(result);
        res.json({
            data: "Canceled"
        })
    });
});

//Rate order
helperMethods.router().put('/Rate/:oID/:sID', (req, res, next) => {

    const putQuery = "UPDATE orders SET oRating = ?, oFeedback = ? WHERE oID = ?";
    helperMethods.conn().query(putQuery, [req.body.oRating, req.body.oFeedback, req.params.oID], (err, result, fields) => {
        console.log(err);
        const selQuery = "SELECT shops.*,(SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders, orders.* FROM shops INNER JOIN orders ON shops.sID = orders.sID AND orders.oID = ?";
        helperMethods.conn().query(selQuery, req.params.oID, (err, result, fields) => {
            console.log(err);
            if (!err) {
                console.log("new order");
                console.log(result[0]);
                //Prepare notification
                //TODO: set topic to anyone subscribed to the shop ID
                const message = {
                    "topic": "" + result[0].sReceiver,
                    "android": {
                        "notification": {
                            "title": "" + result[0].oNumber,
                            "body": "Rating: " + result[0].oRating + "\nAdditional comments: " + result[0].oFeedback,
                            "click_action": "OrdersActivity",
                            "channel_id": "incoming_order",
                            "tag": "" + result[0].oNumber,
                            "notification_priority": "PRIORITY_HIGH",
                            "visibility": "PUBLIC",
                            "color": "#C45A26",
                        }
                    },

                    "data": {
                        "sID": "" + result[0].sID,
                        "sName": "" + result[0].sName,
                        "sSmallPicture": "" + result[0].sSmallPicture,
                        "sBigPicture": "" + result[0].sBigPicture,
                        "sShortDescrption": "" + result[0].sShortDescrption,
                        "sFullDescription": "" + result[0].sFullDescription,
                        "sLatitude": "" + result[0].sLatitude,
                        "sLongitude": "" + result[0].sLongitude,
                        "sAddress": "" + result[0].sAddress,
                        "sAveTime": "" + result[0].sAveTime,
                        "sOperatingHrs": "" + result[0].sOperatingHrs,
                        "isActive": "" + result[0].isActive,
                        "isPast": "true ",
                        "oID": "" + result[0].oID,
                        "sStatus": "" + result[0].sStatus
                    }
                };

                const putShopQuery = "UPDATE shops SET shops.sRating = (SELECT AVG(orders.oRating) FROM orders WHERE orders.sID = ? AND orders.oRating > 0) WHERE shops.sID = ?";
                //Send notification
                helperMethods.sendNotification(message, helperMethods.conn().query(putShopQuery, [req.params.sID, req.params.sID], (err, result, fields) => {
                    console.log(err);
                    console.log(result);
                    res.json({
                        data: "saved"
                    })
                }));
            }
        });


    });
});

module.exports = helperMethods.router();