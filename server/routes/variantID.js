const router = require('express').Router();
let Variant_Annotation = require('../models/variant.model');

router.route('/:variantID').get(async(req, res) => {
    try{
        await Variant_Annotation.find({ "variantID": req.params.variantID })
            .then(snp => res.json(snp))
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

