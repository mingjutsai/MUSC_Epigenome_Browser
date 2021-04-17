const router = require('express').Router();
let promoter_hMSC = require('../models/promoter.hMSC.model');

router.route('/:gene').get(async(req, res) => {
    try{
        await promoter_hMSC.find( {"Gene": req.params.gene} )
        .then(gene => res.json(gene))       
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;