const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3005;
const server = http.createServer(app);
require('babel-register')({
    presets: ['env']
});

server.listen(port, () => {
    console.log("server started");
});    

module.exports = require('./app.js')
