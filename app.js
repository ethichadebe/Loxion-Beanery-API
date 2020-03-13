const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//importing routes
const userRoutes = require('./api/routes/users')

app.use(morgan('dev'));

app.use('/users', userRoutes);

module.exports = app;