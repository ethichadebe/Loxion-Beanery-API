const helperMethods = require('../../util/util');

//Returns all users
helperMethods.router().get('/sTotal/:sID', (req, res, next) => {
    helperMethods.conn().query("SELECT SUM(orders.oPrice) AS sTotalMade FROM orders WHERE orders.sID = 1", (err, result, fields) => {
        console.log(err)
        console.log(result)
        res.json({
            sTotal: result
        });
    });
});

module.exports = helperMethods.router();