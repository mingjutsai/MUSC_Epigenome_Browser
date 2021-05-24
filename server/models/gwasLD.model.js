const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GWASLDSchema = new Schema({
}, {
    collection: 'gwasLD'
});

const gwasLD = mongoose.model('gwasLD', GWASLDSchema);

module.exports = gwasLD;