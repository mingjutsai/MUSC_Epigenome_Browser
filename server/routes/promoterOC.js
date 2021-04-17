const router = require('express').Router();
let promoter_OC = require('../models/promoter.OC.model');

router.route('/:regulatoryBin').get(async(req, res) => {
    try{
        await promoter_OC.find( {"HiC_Distal_bin": req.params.regulatoryBin} )
        .then(regulatoryBin => res.json(regulatoryBin))
    } catch (error) {
        console.log(error)
    }
});
module.exports = router;
