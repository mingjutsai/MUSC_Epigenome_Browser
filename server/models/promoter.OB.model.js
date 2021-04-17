const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promoter_OBSchema = new Schema({
}, {
    collection: 'promoter_OB'
});

const promoter_OB = mongoose.model('promoter_OB', promoter_OBSchema);

module.exports = promoter_OB;