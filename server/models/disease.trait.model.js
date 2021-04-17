const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DiseaseTraitSchema = new Schema({
}, {
    collection: 'DiseaseTraits'
});

const DiseaseTraits = mongoose.model('DiseaseTraits', DiseaseTraitSchema);

module.exports = DiseaseTraits;