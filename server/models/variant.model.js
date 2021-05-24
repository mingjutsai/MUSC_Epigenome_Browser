const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VariantAnnotationSchema = new Schema({
}, {
    collection: 'SNP'
});

const Variant_Annotation = mongoose.model('SNP', VariantAnnotationSchema);

module.exports = Variant_Annotation;