const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnotationSchema = new Schema({
}, {
    collection: 'dbSNP_Annotation'
});

const dbSNP_Annotation = mongoose.model('dbSNP_Annotation', AnnotationSchema);

module.exports = dbSNP_Annotation;