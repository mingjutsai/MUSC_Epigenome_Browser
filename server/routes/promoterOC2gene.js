const router = require('express').Router();
let promoter_OC = require('../models/promoter.OC.model');

router.route('/:gene').get(async(req, res) => {
    try{
        await promoter_OC.find( {"Gene": req.params.gene} )
        .then(gene => res.json(gene))       
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;