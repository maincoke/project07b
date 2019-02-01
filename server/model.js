const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

let EventSchema = new dataSchema({
    id: { type: objectId, require: true, unique: true, index: true, alias: 'evid' },
    title: { type: String, require: true, alias: 'evtitle' },
    start: { type: Date, require: true, alias: 'evstart' },
    end: { type: Date, alias: 'evend' },
    allDay: { type: Boolean, require: true, alias: 'allday' }
}, { _id: false });

let UserSchema = new dataSchema({
    identusr: { type: objectId, unique: true, index: true, alias: 'idusr' },
    namesusr: { type: String, require: true, alias: 'names' },
    dbirtusr: { type: Date, require: true, alias: 'dbirth' },
    emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'email' },
    pwordusr: { type: String, require: true, alias: 'pword' },
    schedule: [EventSchema]
});

let UserData = mongoose.model('Usuario', UserSchema);
module.exports = UserData;