/**
 * Script para la inclusión de un usuario para verificación y comprobación de App //
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const objectId = mongoose.Types.ObjectId;
const newuuid4 = require('uuid/v4');
const User = require('./model.js');
const BCRYPT_SALT_ROUNDS = 6;

/* Conexión con la BD MongoDB con el framework Mongoose */
const urldb = 'mongodb://localhost/schedule';
mongoose.connect(urldb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Hubo un error en la conexión con el MongoDB:\n'));
db.once('open', function() {
    console.log('Conexión con BD exitosa!!');
    console.log(new Date(Date.now()));
});

/* Ingreso de usuario de Pruebas */
let pworduser = 'cxavier2903';
bcrypt.hash(pworduser, BCRYPT_SALT_ROUNDS).then(function(pwordHashed) {
    let newuser = new User({
        identusr: newuuid4(),
        namesusr: 'Charles Xavier',
        dbirtusr: new Date('1945-03-29'),
        emailusr: 'charlesxavier2903@nextu.com',
        pwordusr: pwordHashed,
        schedule: [{ id: new objectId }]
    });
    newuser.save().then(doc => {
        console.log("Registro de usuario de prueba: [ " + newuser.emailusr + " ],\nfue agregado con éxito!!");
        process.exit(0);
    }).catch(function(error) {
        console.log("Hubo un error en el registro de usuario!!");
        console.log(error);
        process.exit(1);
    });
}).catch(function(error) {
    console.log("Error: La contraseña no se logró generar con éxito!!");
});