const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promoter_OCSchema = new Schema({
}, {
    collection: 'promoter_OC'
});

const promoter_OC = mongoose.model('promoter_OC', promoter_OCSchema);

module.exports = promoter_OC;