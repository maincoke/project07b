/**
 * Funcionalidad de Servidor Node.js
 * 
 * Importacion de paquetes instalados para inicializar servidor Node.js
 */
const http = require('http'),
    path = require('path'),
    Routing = require('./paths.js'),
    express = require('express'),
    session = require('express-session'),
    genuuid = require('uuid/v4'),
    levelSession = require('level-session-store')(session),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

/* Configuración de instancias y variables del Servidor */
const PORT = 3000;
const calendar = express();
const Server = http.createServer(calendar);
const urldb = 'mongodb://localhost/schedule';

/* Conexión con la BD MongoDB con el framework Mongoose */
mongoose.connect(urldb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Hubo un error en la conexión con el MongoDB:\n'));
db.once('open', function() {
    console.log('Conexión con BD exitosa!!');
    console.log(new Date(Date.now()));
});

/* Uso de libreria para el manejo de sesion */
calendar.use(session({
    genid: function(req) {
        return genuuid();
    },
    secret: 'Schedule Evt',
    name: 'schedule.id',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 1200000 },
    store: new levelSession('./user/session/schedule')
}));

/* Uso de instancia de servidor para configurar carpeta publica cliente, enrutador de funciones y contenido body-parser */
calendar.use(express.static('../client'));
calendar.use(bodyParser.json());
calendar.use(bodyParser.urlencoded({ extended: true }));
calendar.use('/schedule', Routing);

/**
 * Inicio y puesta en marcha del Servidor
 */
Server.listen(PORT, function() {
    console.log('Server is up!! Running & listennig on port: ' + PORT);
});