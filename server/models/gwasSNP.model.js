const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GWASSNPSchema = new Schema({
}, {
    collection: 'gwasSNP'
});

const GWASSNP = mongoose.model('gwasSNP', GWASSNPSchema);

module.exports = GWASSNP;