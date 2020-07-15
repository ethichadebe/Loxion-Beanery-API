const helperMethods = require('../../util/util');

//Returns all shops
helperMethods.router().get('/:uID/:sLatitude/:sLongitude', (req, res, next) => {
	helperMethods.conn().query("SELECT shops.*, (SELECT COUNT(*) FROM shoplikes WHERE shoplikes.uID = ? AND (shoplikes.sID = shops.sID)) AS isLiked, (SELECT 111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(shops.sLatitude)) * COS(RADIANS(?)) * COS(RADIANS(shops.sLongitude - ?)) + SIN(RADIANS(shops.sLatitude)) * SIN(RADIANS(?)))))) AS distance FROM shops WHERE shops.isActive = 1 ORDER BY shops.sStatus DESC, distance ASC", [req.params.uID, req.params.sLatitude, req.params.sLongitude, req.params.sLatitude], (err, rows, fields) => {
		console.log(err);
		console.log(rows);
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
helperMethods.router().get('/MyShops/:uID', (req, res, next) => {
	helperMethods.conn().query("SELECT shops.*, usershopbridge.uRole, (SELECT COUNT(*) FROM orders WHERE (shops.sID = orders.sID) AND (orders.oStatus = 'Waiting for order')) AS nOrders FROM shops, usershopbridge WHERE (shops.sID = usershopbridge.sID) AND (usershopbridge.uID = ?) AND (shops.isActive != 2) ORDER BY shops.sStatus DESC", [req.params.uID], (err, rows, fields) => {//WHERE uID=?", 
		console.log(err);
		console.log(rows);
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
helperMethods.router().get('/MenuItems/:sID', (req, res, next) => {
	helperMethods.conn().query("SELECT * FROM `menuitems` WHERE sID = ? ORDER BY `mPrice` ASC", req.params.sID, (err, rows, fields) => {
		console.log(err);
		console.log(rows);
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
helperMethods.router().get('/Ingredients/:sID', (req, res, next) => {
	helperMethods.conn().query("SELECT ingredients.*, (SELECT COUNT(*) FROM `extras` WHERE sID = ?) AS nExtras FROM `ingredients` WHERE sID = ?", [req.params.sID, req.params.sID], (err, rows, fields) => {
		console.log(err);
		console.log(rows);
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
helperMethods.router().get('/Extras/:sID', (req, res, next) => {
	helperMethods.conn().query("SELECT * FROM `extras` WHERE sID = ?", [req.params.sID], (err, rows, fields) => {
		console.log(err);
		console.log(rows);
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
helperMethods.router().post('/RegisterShop', helperMethods.upload().fields([{ name: 'sSmallPicture' }, { name: 'sBigPicture' }]), (req, res, next) => {
	const insQuery = "INSERT INTO shops(`sName`,`sShortDescrption`,`sFullDescription`, `sSmallPicture`, `sBigPicture`, `sLatitude`, `sLongitude`,`sRating`,`sReceiver`,`sStatus`,`sLikes`,`sOperatingHrs`,`sAddress`,`isActive`,`sCreatedAt`) VALUES (?, ?,?, '" +
		req.files.sSmallPicture[0].location + "', '" + req.files.sBigPicture[0].location + "', ?, ?, 0.0,?, 0,0,?,?,0, '" + helperMethods.createdAt() + "')";

	helperMethods.conn().query(insQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
	req.body.sLatitude, req.body.sLongitude, req.body.uID, req.body.sOperatingHrs, req.body.sAddress], (err, result, fields) => {
		console.log(err);
		console.log(result);
		var sID = result.insertId;
		const insQuery1 = "INSERT INTO usershopbridge(`uID`,`sID`,`uRole`, `usbCreatedAt`) VALUES (?, " + sID + ", 'Owner', '" + helperMethods.createdAt() + "')";
		helperMethods.conn().query(insQuery1, [req.body.uID], (err, result, fields) => {
			console.log(err);
			console.log(result);
			res.json({
				data: sID
			})
		});
	});
});

//Register shop Ingredients
helperMethods.router().post('/Register/Ingredient', (req, res, next) => {
	const insQuery = "INSERT INTO ingredients(`iName`,`iPrice`,`sID`,`isActive`,`iCreatedAt`) VALUES (?, ?, ?, 1, '" + helperMethods.createdAt() + "')";

	helperMethods.conn().query(insQuery, [req.body.iName, req.body.iPrice, req.body.sID], (err, result, fields) => {
		const selQuery = "SELECT * FROM `ingredients` WHERE iID = ?";
		console.log(req.body.iPrice);

		helperMethods.conn().query(selQuery, result.insertId, (err, result, fields) => {
			console.log(err);
			console.log(result);
			res.json({
				data: "saved",
				response: result
			})
		});
	});
});

//Register shop Menu items
helperMethods.router().post('/Register/MenuItem', (req, res, next) => {
	const insQuery = "INSERT INTO `menuitems` (`mList`, `mPrice`, `isActive`, `sID`, `mCreatedAt`) VALUES (?, ?, '0', ?, '" + helperMethods.createdAt() + "')";
	const checkQuesry = "SELECT COUNT(menuitems.sID) AS nItems FROM menuitems WHERE menuitems.sID = ?";
	const ActivateQuery = "UPDATE `shops` SET `isActive` = '1' WHERE `shops`.`sID` = ?;";
	const selQuery = "SELECT * FROM `menuitems` WHERE mID = ?";
	helperMethods.conn().query(insQuery, [req.body.mList, req.body.mPrice, req.body.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		var ID = result.insertId;
		helperMethods.conn().query(checkQuesry, [req.body.sID], (err, result, fields) => {
			console.log(result);
			console.log(err);
			console.log(result[0].nItems);
			if (result[0].nItems == 1) {
				helperMethods.conn().query(ActivateQuery, req.body.sID, (err, result, fields) => {
					console.log(err);
					console.log("isActive activated");
					console.log(result);
					helperMethods.conn().query(selQuery, ID, (err, result, fields) => {
						console.log(err);
						console.log(result);
						res.json({
							data: "saved",
							response: result
						})
					});
				});

			} else {
				helperMethods.conn().query(selQuery, ID, (err, result, fields) => {
					console.log("else");
					console.log(err);
					console.log(result);
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
helperMethods.router().post('/Register/Extra', (req, res, next) => {
	const insQuery = "INSERT INTO extras(`eName`,`isActive`,`sID`,`eCreatedAt`) VALUES (?, 1,?, '" + helperMethods.createdAt() + "')";

	helperMethods.conn().query(insQuery, [req.body.eName, req.body.sID], (err, result, fields) => {
		const selQuery = "SELECT * FROM `extras` WHERE eID = ?";

		helperMethods.conn().query(selQuery, result.insertId, (err, result, fields) => {
			console.log(err);
			console.log(result);
			res.json({
				data: "saved",
				response: result
			})
		});
	});
});

//Delete shop Ingredients
helperMethods.router().delete('/Register/Ingredient/:iID', (req, res, next) => {
	const delQuery = "DELETE FROM `ingredients` WHERE `ingredients`.`iID` = ?";

	helperMethods.conn().query(delQuery, [req.params.iID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "removed"
		})
	});
});

//Delete shop Menu items
helperMethods.router().delete('/Register/MenuItem/:mID/:sID', (req, res, next) => {
	const delQuery = "DELETE FROM `menuitems` WHERE `menuitems`.`mID` = ?";
	const DeactivateQuery = "UPDATE `shops` SET `isActive` = '0' WHERE `shops`.`sID` = ?;";
	const checkQuesry = "SELECT COUNT(menuitems.sID) AS nItems FROM menuitems WHERE menuitems.sID = ?";

	var sID = req.params.sID;
	helperMethods.conn().query(delQuery, [req.params.mID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		if (result == undefined) {
			res.err("something went wrong please try again")
		} else {
			helperMethods.conn().query(checkQuesry, [sID], (err, result, fields) => {
				console.log(result);
				console.log(err);
				console.log(result[0].nItems);
				if (result[0].nItems == 0) {
					helperMethods.conn().query(DeactivateQuery, [sID], (err, result, fields) => {
						console.log(sID);
						console.log(err);
						console.log("isActive deactivated");
						console.log(result);
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

//Delete shop
helperMethods.router().delete('/Delete/:sID', (req, res, next) => {
	const delShopQuery = "DELETE FROM `shops` WHERE `shops`.`sID` = ?";
	const delLinkQuery = "DELETE FROM `ingredients` WHERE `ingredients`.`sID` = ?";
	const delIngredientsQuery = "DELETE FROM `usershopbridge` WHERE `usershopbridge`.`sID` = ?";

	var sID = req.params.sID;
	helperMethods.conn().query(delIngredientsQuery, [req.params.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		helperMethods.conn().query(delLinkQuery, [req.params.sID], (err, result, fields) => {
			console.log(err);
			console.log(result);
			helperMethods.conn().query(delShopQuery, [req.params.sID], (err, result, fields) => {
				console.log(err);
				console.log(result);
				res.json({
					data: "removed",
					response: result
				});
			});
		});
	});
});

//Delete shop Extras
helperMethods.router().delete('/Register/Extra/:eID', (req, res, next) => {
	const delQuery = "DELETE FROM `extras` WHERE `extras`.`eID` = ?";

	helperMethods.conn().query(delQuery, [req.body.eID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "removed"
		})
	});
});

//Put shop
helperMethods.router().put('/Register/:sID', helperMethods.upload().fields([{ name: 'sSmallPicture' }, { name: 'sBigPicture' }]), (req, res, next) => {
	const putQuery = "UPDATE shops SET `sName` = ?,`sShortDescrption` = ?,`sFullDescription` = ?, `sSmallPicture` = '" + req.files.sSmallPicture[0].location + "', `sBigPicture` =  '" + req.files.sBigPicture[0].location + "', `sLatitude` = ?, `sLongitude` = ?, `sAddress` = ? WHERE sID = ?";

	helperMethods.conn().query(putQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
	req.body.sLatitude, req.body.sLongitude, req.body.sAddress, req.params.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "changed"
		})
	});
});
//Put shop
helperMethods.router().put('/CompleteRegister/:sID', helperMethods.upload().fields([{ name: 'sSmallPicture' }, { name: 'sBigPicture' }]), (req, res, next) => {
	const putQuery = "UPDATE shops SET `sName` = ?,`sShortDescrption` = ?,`sFullDescription` = ?, `sSmallPicture` = '" + req.files.sSmallPicture[0].location + "', `sBigPicture` =  '" + req.files.sBigPicture[0].location + "', `sLatitude` = ?, `sLongitude` = ?, `sAddress` = ?, `sOperatingHrs` = ? WHERE sID = ?";

	helperMethods.conn().query(putQuery, [req.body.sName, req.body.sShortDescrption, req.body.sFullDescription,
	req.body.sLatitude, req.body.sLongitude, req.body.sAddress, req.body.sOperatingHrs, req.params.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		if (!err) {
			res.json({
				data: "changed"
			})
		}
	});
});

//Put operating hours
helperMethods.router().put('/Register/OH/:sID', (req, res, next) => {
	const putQuery = "UPDATE shops SET `sOperatingHrs` = ? WHERE sID = ?";

	helperMethods.conn().query(putQuery, [req.body.sOperatingHrs, req.params.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "changed"
		})
	});
});

//Put shop Ingredients
helperMethods.router().put('/Register/Ingredient/:iID/:sID', (req, res, next) => {
	var newName = req.body.iName;
	var oldName = req.body.iPrevious;
	var newPrice = req.body.iPrice;
	var ingredientID = req.params.sID;
	var shopID = req.params.sID;

	const putQuery = "UPDATE ingredients SET iName = ?, iPrice = ? WHERE iID = ?";
	helperMethods.conn().query(putQuery, [newName, newPrice, ingredientID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		const updateMenuQuery = "UPDATE menuitems SET menuitems.mList = REPLACE (menuitems.mList, ?, ?) WHERE menuitems.sID = ?";

		helperMethods.conn().query(updateMenuQuery, [oldName, newName, shopID], (err, result, fields) => {
			console.log(err);
			console.log(result);
			if (result.changedRows > 0) {
				res.json({
					data: "changed"
				})
			}
		});
	});
});

//Put shop Menu items
helperMethods.router().put('/Register/MenuItems/:mID', (req, res, next) => {
	const putQuery = "UPDATE menuitems SET mList = ?, mPrice = ? WHERE mID = ?";

	helperMethods.conn().query(putQuery, [req.body.mList, req.body.mPrice, req.params.mID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "changed"
		})
	});
});

//Put shop Extras
helperMethods.router().put('/Register/Extra/:eID', (req, res, next) => {
	const putQuery = "UPDATE extras SET eName = ? WHERE eID = ?";

	helperMethods.conn().query(putQuery, [req.body.eName, req.params.eID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "saved"
		})
	});
});

//Put shop Status
helperMethods.router().put('/Status/:sID', (req, res, next) => {
	const putQuery = "UPDATE shops SET sStatus = ? WHERE sID = ?";

	helperMethods.conn().query(putQuery, [req.body.sStatus, req.params.sID], (err, result, fields) => {
		if (!err && (req.body.sStatus == "0")) {
			console.log({
				settingStatus: result
			});
			console.log({
				status: req.body.sStatus,
				sID: req.params.sID,
				sFeedback: req.body.sFeedback
			});
			const putQuery = "UPDATE orders SET oCollectedAt = '" + helperMethods.createdAt() + "', oStatus = 'Cancelled' WHERE sID = ? AND oStatus = 'Waiting for order'";

			helperMethods.conn().query(putQuery, [req.params.sID], (err, result, fields) => {
				if (!err) {
					console.log({ Candelled_orders: result });
					//Prepare notification
					const message = {
						"topic": ""+ req.params.sID,
						"android": {
							"notification": {
								"title": "Orders cancelled",
								"body": "All orders from " + req.body.sName + " have been cancelled due to unexpected shop closure\nMore Information: "
									+ req.body.sFeedback,
								"click_action": "LoginActivity",
								"channel_id": "ready_for_collection",
								"tag": "" + req.params.sID,
								"notification_priority": "PRIORITY_HIGH",
								"visibility": "PUBLIC",
								"color": "#C45A26",
							}
						},

						"data": {
							"oID": "" + req.params.sID
						}
					};

					helperMethods.sendNotification(message, res.json({ data: "saved" }));

				} else {
					console.log(err);
				}
			});
		} else if (!err) {
			console.log(err);
			console.log(result);
			res.json({
				data: "saved"
			})
		} else {
			console.log(err);
		}
	});
});

//Deactivate Shop
helperMethods.router().put('/deactivate/:sID', (req, res, next) => {
	const putQuery = "UPDATE shops SET isActive = 2 WHERE sID = ?";

	helperMethods.conn().query(putQuery, [req.params.sID], (err, result, fields) => {
		console.log(err);
		console.log(result);
		res.json({
			data: "deactivated"
		})
	});
});

module.exports = helperMethods.router();