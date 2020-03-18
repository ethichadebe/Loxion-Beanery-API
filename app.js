const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//importing routes
const userRoutes = require('./api/routes/users')
const shopRoutes = require('./api/routes/shops')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/users', userRoutes);
app.use('/shops', shopRoutes);

module.exports = app;