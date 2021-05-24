const router = require('express').Router();
let GWAS2SNP = require('../models/gwasSNP.model');
let DiseaseTraits = require('../models/disease.trait.model');

router.route('/:disease').get(async(req, res) => {
    try{
        await GWAS2SNP.find( {"disease_trait": req.params.disease} )
        .then(disease => res.json(disease))
    } catch (error) {
        console.log(error);
    }
});

router.route('/').get(async(req, res) => {
    try{
        await DiseaseTraits.find()
        .then(trait => res.json(trait))
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;