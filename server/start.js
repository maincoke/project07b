const http = require('http'),
    path = require('path'),
    Routing = require('./paths.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

const PORT = 3000;
const app = express();
const Server = http.createServer(app);

const urldb = 'mongodb://localhost/schedule';
mongoose.connect(urldb, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
    console.log('Conexión con BD exitosa!!');
});

app.use(express.static('../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/schedule', Routing);

Server.listen(PORT, function() {
    console.log('Server is up!! Running & listennig on port: ' + PORT);
});