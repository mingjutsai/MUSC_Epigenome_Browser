const router = require('express').Router();
let gwasLD = require('../models/gwasLD.model');

router.route('/:variantID').get(async(req, res) => {
    try{
        await gwasLD.find({ "IndexSNP": req.params.variantID })
            .then(snp => res.json(snp))
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

