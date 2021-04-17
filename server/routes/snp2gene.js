const router = require('express').Router();
let dbSNP_Annotation = require('../models/snp.model');

router.route('/:gene').get(async(req, res) => {
    try{
        await dbSNP_Annotation.find({ $and: [ {"GeneName_ID_Ensembl": req.params.gene}, {"Region_Ensembl": "exonic"}] })
            .then(gene => res.json(gene))
    }catch (error) {
        console.log(error);
    }
})

module.exports = router;