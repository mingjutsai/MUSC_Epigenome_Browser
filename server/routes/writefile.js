const router = require('express').Router();
const fs = require('fs')
const hic_resolution = process.env.HIC_RESOLUTION;

require('dotenv').config();

router.route('/').post((req, res) => {
    if(req.body.type == "snp"){
        const rsid = req.body.post;
        const content = req.body.range;
        fs.writeFile('../public/igv/' + rsid + '.bed', content, err => {
            if(err) {
                console.log(err)
                return
            }
        })
    }else if(req.body.type == "interaction"){
        const rsid = req.body.rsid;
        const content = req.body.content;
        const cell = req.body.cell;
        fs.writeFile('../public/igv/' + rsid + '_' + cell + '.bedpe.txt', content, err => {
            if(err) {
                console.log(err)
                return
            }
        })
    }else if(req.body.type == "interactionByGene"){
        const gene = req.body.gene;
        const content = req.body.content;
        const cell = req.body.cell;
        fs.writeFile('../public/igv/' + gene + '_' + cell + '.bedpe.txt', content, err => {
            if(err) {
                console.log(err)
                return
            }
        })
    }
    res.send(
        `Successfully generate file: ${req.body.type}`,
    )
    
});

module.exports = router;