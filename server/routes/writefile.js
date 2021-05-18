const router = require('express').Router();
const fs = require('fs');
//require('dotenv').config();
//const igv_path = process.env.IGV_PATH;
const igvDir = __dirname + '/../../public/igv/'
var igvInput;
router.route('/').post((req, res) => {
    if(req.body.type == "snp"){
        const rsid = req.body.post;
        const content = req.body.range;
        igvInput = igvDir + rsid + '.bed'
        //const filePath = __dirname + '/../../public/igv/'
        if(fs.existsSync(igvDir)){
            //console.log('Directory exists!')
            //fs.writeFile('../public/igv/' + rsid + '.bed', content, err => {
            fs.writeFile(igvInput, content, err => {
                    if(err) {
                        console.log(err)
                        return err
                    }
                })
        }else{
            console.log('Directory not found.')
            return 'Directory not found.';
        }
        //console.log(filePath)
        // fs.writeFile('../public/igv/' + rsid + '.bed', content, err => {
        // //fs.writeFile(igv_path + rsid + '.bed', content, err => {
        //     if(err) {
        //         console.log(err)
        //         return
        //     }
        // })
    }else if(req.body.type == "interaction"){
        const rsid = req.body.rsid;
        const content = req.body.content;
        const cell = req.body.cell;
        igvInput = igvDir + rsid + '_' + cell + '.bedpe.txt';
        //fs.writeFile('../public/igv/' + rsid + '_' + cell + '.bedpe.txt', content, err => {
        fs.writeFile(igvInput, content, err => {
            if(err) {
                console.log(err)
                return err
            }
        })
    }else if(req.body.type == "interactionByGene"){
        const gene = req.body.gene;
        const content = req.body.content;
        const cell = req.body.cell;
        igvInput = igvDir + gene + '_' + cell + '.bedpe.txt';
        //fs.writeFile('../public/igv/' + gene + '_' + cell + '.bedpe.txt', content, err => {
        fs.writeFile(igvInput, content, err => {
            if(err) {
                console.log(err)
                return err
            }
        })
    }else if(req.body.type == "LD"){
        const indexSNP = req.body.indexSNP;
        const content = req.body.content;
        igvInput = igvDir + indexSNP + '_LD.bed';
        fs.writeFile(igvInput, content, err => {
            if(err) {
                console.log(err)
                return err
            }
        })
    }
    res.send(
        `Successfully generate file: ${igvInput}`,
    )
    // if(fs.existsSync(igvInput)){
    //     res.send(
    //         `Successfully generate file: ${igvInput}`,
    //     )
    // }else{
    //     res.send(
    //         `Failed generate file: ${igvInput}`,
    //     )
    // }
    // res.send(
    //     `Successfully generate file: ${req.body.type}`,
    // )
    
});

module.exports = router;