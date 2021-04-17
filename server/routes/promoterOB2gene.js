const router = require('express').Router();
let promoter_OB = require('../models/promoter.OB.model');

router.route('/:gene').get(async(req, res) => {
    try{
        await promoter_OB.find( {"Gene": req.params.gene} )
        .then(gene => res.json(gene))       
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;