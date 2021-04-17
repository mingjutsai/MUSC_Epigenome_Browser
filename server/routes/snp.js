const router = require('express').Router();
let dbSNP_Annotation = require('../models/snp.model');

router.route('/:rsid').get(async(req, res) => {
    try{
        await dbSNP_Annotation.find({ "RSID": req.params.rsid })
            .then(snp => res.json(snp))
    } catch (error) {
        console.log(error);
    }
    /*
    dbSNP_Annotation.find({ "RSID": req.params.rsid })
        .then(snp => res.json(snp))
        .catch(err => res.status(400).json('Error ' + err));
    */
    //dbSNP_Annotation.find({ "RSID": req.params.rsid }, (err, snp) => {
    //    if(err) return handleError(err);
    //    console.log(req.params.rsid + "data is being fetched")
    //    res.send(snp);
    //})
});

module.exports = router;

