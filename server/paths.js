/**
 * Enrutador de funciones para las peticiones de GET y POST de la App Agenda
 * 
 * Importación de paquetes instalados para la funcionalidad de modulos GET Y POST
 */
const Router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const newuuid4 = require('uuid/v4');
const User = require('./model.js');
const BCRYPT_SALT_ROUNDS = 6;

// Verificación y regeneración de sesión del Usuario //
Router.get('/', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        res.redirect('/all');
    } else {
        res.redirect('/');
    }
});

// Verificación de Login, acceso y configuración de sesion del Usuario //
Router.post('/login', function(req, res) {
    let username = req.body.user,
        userpass = req.body.pass;
    User.findOne({ emailusr: username }).exec().then(doc => {
        bcrypt.compare(userpass, doc.pwordusr).then(validPword => {
            let result;
            if (!validPword) {
                result = { access: '', msg: 'Las credenciales no son válidas!! La contraseña no es correcta!!' };
            } else {
                req.session.regenerate(error => { if (error) throw console.error(error) });
                let sessusr = req.session;
                sessusr.username = username;
                sessusr.userId = doc.identusr;
                result = { id: doc.identusr, username: doc.emailusr, access: 'ok' };
            }
            res.send(result);
        });
    }).catch(error => {
        let wrong = { access: '', msg: 'Cuenta de usuario no se encuentra registrada!!' };
        res.send(wrong);
        console.log('Error en la autenticación del usuario: \n' + error);
    });
});

// Terminación de sesisión y salida de la App Agenda //
Router.get('/logout', function(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            console.log('Hubo un error en el cierre de la sessión!!');
        } else {
            res.redirect('/');
        }
    });
});

// Inclusión de datos básicos del Usuario  //
Router.post('/newuser', function(req, res) {
    let username = req.body.user_email;
    let findmail = User.where({ emailusr: username });
    findmail.findOne((error) => {
        if (error) {
            let pworduser = req.body.user_pword;
            bcrypt.hash(pworduser, BCRYPT_SALT_ROUNDS).then(function(pwordHashed) {
                let newuser = new User({
                    identusr: newuuid4(),
                    namesusr: req.body.user_names,
                    dbirtusr: req.body.user_dbirt,
                    emailusr: req.body.user_email,
                    pwordusr: pwordHashed,
                    schedule: [{ id: new objectId }]
                });
                newuser.save().then(doc => {
                    let result = { id: doc.identusr, msg: "Registro de usuario agregado con éxito!!" };
                    res.send(result);
                }).catch(function(error) {
                    let wrong = { msg: "Hubo un error en el registro de usuario!!" };
                    res.send(wrong);
                    console.log('Error en el registro de usuario: ');
                });
            }).catch(function(error) {
                let wrong = { msg: "Error: La contraseña no se logró generar con éxito!!" };
                res.send(wrong);
            });
        } else {
            let wrong = { msg: "La cuenta con la dirección de correo " + username + ",\n ya se encuentra registrada!!" };
            res.send(wrong);
        }
    });
});

// Inclusión de un nuevo evento del usuario para la Agenda //
Router.post('/new', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOne({ identusr: sessusr.userId }).exec().then(doc => {
            let event = req.body;
            event.id = new objectId;
            doc.schedule.push(event);
            doc.save().then((evtusr) => {
                let success = { id: event.id, msg: "Evento agendado con éxito!!" };
                res.send(success);
            }).catch(error => {
                let wrong = { msg: 'Hubo un error en el registro del evento!!' };
                res.send(wrong);
                console.log('Error en la inclusión del evento: ');
            });
        }).catch(error => {
            let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
            res.send(wrong);
            console.log('Error en la autenticación del usuario: ');
        });
    } else {
        res.status(400).send();
    }
});

// Eliminación de evento en la agenda del Usuario //
Router.post('/delete/:id', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOneAndUpdate({ identusr: sessusr.userId }, { $pull: { schedule: { id: req.params.id } } }, (error, doc) => {
            if (!error) {
                let scheduleDoc = doc.schedule;
                let eventdel = scheduleDoc.findIndex(evt => evt.id == req.params.id);
                res.send("El evento:\n [ " + scheduleDoc[eventdel].title + " ],\nfue borrado con éxito!!");
            } else {
                res.send("Hubo un error al borrar el evento!!");
                console.log('Error en la eliminación del evento: ');
            }
        });
    } else {
        res.status(400).send();
    }
});

// Actualización de evento en la agenda del usuario: cambio de dia y hora. NO la duración del evento //
Router.post('/update', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOneAndUpdate({ identusr: sessusr.userId, "schedule.id": req.body.id }, { $set: { 'schedule.$.start': req.body.start, 'schedule.$.end': req.body.end } }, (error, doc) => {
            if (!error) {
                res.send("El evento fue reagendado y actualizado con éxito!!");
            } else {
                res.send("Hubo un error al actualizar el evento!!");
                console.log('Error en la actualización del evento: ');
            }
        });
    } else {
        res.status(400).send();
    }
});

// Obtención de todos los eventos agendados del usuario para el calendario //
Router.get('/all', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOne({ emailusr: sessusr.username }).exec().then(doc => {
            let datauser = { username: doc.emailusr, eventos: doc.schedule };
            res.send(datauser);
        }).catch(error => {
            let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
            res.send(wrong);
            console.log('Error en la autenticación del usuario: ');
        });
    } else {
        res.status(400).send();
    }
});

module.exports = Router;