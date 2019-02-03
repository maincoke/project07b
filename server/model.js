/**
 * Configuración y exportación del Esquema de Datos para BD de MongoDB
 * 
 * Importacion de paquetes instalados para configurar los esquemas de datos de Nivel 1 y 2
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

/* Esquema de Datos de los Eventos de Usuario para el Calendario - Nivel 2 */
let EventSchema = new dataSchema({
    id: { type: objectId, require: true, unique: true, alias: 'evid' },
    title: { type: String, require: true, alias: 'evtitle' },
    start: { type: Date, require: true, alias: 'evstart' },
    end: { type: Date, alias: 'evend' },
    allDay: { type: Boolean, require: true, alias: 'allday' }
}, { _id: false });

/* Esquema de Datos del Usuario - Nivel 1 */
let UserSchema = new dataSchema({
    identusr: { type: String, unique: true, index: true, alias: 'idusr' },
    namesusr: { type: String, require: true, alias: 'names' },
    dbirtusr: { type: Date, require: true, alias: 'dbirth' },
    emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'email' },
    pwordusr: { type: String, require: true, alias: 'pword' },
    schedule: [EventSchema]
});

let UserData = mongoose.model('Usuario', UserSchema);
module.exports = UserData;