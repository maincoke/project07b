const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dataSchema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

let EventSchema = new dataSchema({
    identievt: { type: objectId, require: true, alias: 'idevt' },
    titlesevt: { type: String, require: true, alias: 'title' },
    dbeginevt: { type: Date, require: true, alias: 'dbegin' },
    datendevt: { type: Date, alias: 'dend' },
    tbeginevt: { type: Date, alias: 'tbegin' },
    timendevt: { type: Date, alias: 'tend' },
    alldayevt: { type: Boolean, require: true, alias: 'allday' }
}, { _id: false });

let UserSchema = new dataSchema({
    identusr: { type: objectId, require: true, alias: 'idusr' },
    namesusr: { type: String, require: true, alias: 'names' },
    dbirtusr: { type: Date, require: true, alias: 'dbirth' },
    emailusr: { type: String, lowercase: true, trim: true, require: true, alias: 'email' },
    pwordusr: { type: String, require: true, alias: 'pword' },
    schedule: [EventSchema]
}, { _id: false });

let UserData = mongoose.model('Usuario', UserSchema);
module.exports = UserData;