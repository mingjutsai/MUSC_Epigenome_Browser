const router = require('express').Router();
let Disease2SNP = require('../models/disease.model');
let DiseaseTraits = require('../models/disease.trait.model');

router.route('/:disease').get(async(req, res) => {
    try{
        await Disease2SNP.find( {"Disease_trait": req.params.disease} )
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