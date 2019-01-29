const Router = require('express').Router();
const User = require('./model.js');

// Obtener todos los eventos de calendario del usuario
Router.get('/all', function(req, res) {
    User.find({}).exec().then(docs => {
        res.json(docs);
    });
});

// Obtener un usuario por su ID
Router.get('/', function(req, res) {
    let fname = req.query.fname;
    User.findOne({ fnames: fname }).exec().then(doc => {
        res.json(doc);
    });
});

// Agregar un usuario
Router.post('/newuser', function(req, res) {
    let newuser = new User({
        userId: Math.floor(Math.random() * 50),
        fnames: req.body.fnames,
        lnames: req.body.lnames,
        ageusr: req.body.ageusr,
        gender: req.body.gender,
        status: req.body.status
    });
    newuser.save().then(doc => {
        let result = { id: doc.userId, msg: "Registro de usuario agregado con éxito!!" };
        res.send(result);
    });
});

// Eliminar un usuario por su ID
Router.post('/delete/:id', function(req, res) {
    let userid = req.params.id;
    User.remove({ userId: userid }).then(() => {
        res.send("El usuario fue eliminado con éxito!!");
    });
});

// Inactivar un usuario por su ID
Router.post('/inactive/:id', function(req, res) {

});

// Activar un usuario por su ID
Router.post('/active/:id', function(req, res) {

});

module.exports = Router;