const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Disease2SNPSchema = new Schema({
}, {
    collection: 'Disease2SNP'
});

const Disease2SNP = mongoose.model('Disease2SNP', Disease2SNPSchema);

module.exports = Disease2SNP;