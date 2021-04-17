const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promoter_hMSCSchema = new Schema({
}, {
    collection: 'promoter_hMSC'
});

const promoter_hMSC = mongoose.model('promoter_hMSC', promoter_hMSCSchema);

module.exports = promoter_hMSC;