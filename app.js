const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//importing routes
const userRoutes = require('./api/routes/users');
const shopRoutes = require('./api/routes/shops');
const orderRoutes = require('./api/routes/orders');
const shopLikesRoutes = require('./api/routes/shoplikes');

app.use('/Uploads', express.static('Uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/users', userRoutes);
app.use('/shops', shopRoutes);
app.use('/orders', orderRoutes);
app.use('/shoplikes', shopLikesRoutes);

module.exports = app;