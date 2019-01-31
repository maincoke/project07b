const Router = require('express').Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const levelSession = require('level-session-store');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
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
    User.findOne({ emailusr: username }).exec()
        .then(doc => {
            bcrypt.compare(userpass, doc.pwordusr)
                .then(validPword => {
                    let result;
                    if (!validPword) {
                        result = { access: '', msg: 'Las credenciales no son válidas!! La contraseña no es correcta!!' };
                    } else {
                        let sessusr = req.session;
                        sessusr.username = username;
                        sessusr.userId = doc.identusr;
                        result = { id: doc.identusr, username: doc.emailusr, access: 'ok' };
                    }
                    res.send(result);
                });
        })
        .catch(error => {
            let wrong = { access: '', msg: 'Cuenta de usuario no se encuentra registrada!!' };
            res.send(wrong);
            console.log('Error en la autenticación del usuario: ');
            console.error(error);
        });
});

// Terminación de sesisión y salida de la App //
Router.get('/logout', function(req, res) {
    req.session.destroy(function(error) {
        if (error) {
            console.error(error);
        } else {
            res.redirect('/');
        }
    });
});

// Inclusión de datos básicos del Usuario  //
Router.post('/newuser', function(req, res) {
    let pworduser = req.body.user_pword;
    bcrypt.hash(pworduser, BCRYPT_SALT_ROUNDS)
        .then(function(pwordHashed) {
            let newuser = new User({
                identusr: new objectId,
                namesusr: req.body.user_names,
                dbirtusr: req.body.user_dbirt,
                emailusr: req.body.user_email,
                pwordusr: pwordHashed,
            });
            newuser.save().then(doc => {
                let result = { id: doc.identusr, msg: "Registro de usuario agregado con éxito!!" };
                res.send(result);
            });
        })
        .catch(function(error) {
            let wrong = { msg: "Hubo un error en el registro de usuario!!" };
            res.send(wrong);
            console.log('Error en el registro de usuario: ');
            console.error(error);
        });
});



// Eliminación de evento en la agenda del Usuario //
Router.post('/delete/:id', function(req, res) {
    let userid = req.params.id;
    User.remove({ userId: userid }).then(() => {
        res.send("El usuario fue eliminado con éxito!!");
    });
});

// Obtener un usuario por su ID
Router.get('/', function(req, res) {
    let fname = req.query.fname;
    User.findOne({ fnames: fname }).exec().then(doc => {
        res.json(doc);
    });
});

// Obtener todos los eventos de calendario del usuario
Router.get('/all', function(req, res) {
    let sessusr = req.session;
    if (sessusr.username) {
        User.findOne({ emailusr: sessusr.username }).exec()
            .then(doc => {
                let datauser = { username: doc.emailusr, eventos: doc.schedule };
                res.json(datauser);
            })
            .catch(error => {
                let wrong = { msg: 'Cuenta de usuario no existe ó expiró la sessión!!' };
                res.send(wrong);
                console.log('Error en la autenticación del usuario: ');
                console.error(error);
            });
    } else {
        res.status(400).send();
    }
});

module.exports = Router;