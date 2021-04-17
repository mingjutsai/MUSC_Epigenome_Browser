const router = require('express').Router();
const fs = require('fs')
let promoter_hMSC = require('../models/promoter.hMSC.model');

// router.route('/:gene').get((req, res) => {
//     promoter_hMSC.find( {"Gene": req.params.gene} )
//         .then(gene_hMSC => res.json(gene_hMSC))
//         .catch(err => res.status(400).json('Error ' + err));
// });

router.route('/:regulatoryBin').get(async(req, res) => {
    try{
        await promoter_hMSC.find( {"HiC_Distal_bin": req.params.regulatoryBin} )
        .then(regulatoryBin => res.json(regulatoryBin))       
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;