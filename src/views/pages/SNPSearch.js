import React from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { HorizontalBar } from 'react-chartjs-2';
import { MDBContainer } from 'mdbreact';
import igv from 'igv';
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Loader } from '../../vibe/';
//import {APP_URL} from 'react-native-dotenv';

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Label,
  } from "reactstrap";


var igvStyle = {
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: '8px',
    border: '1px solid lightgray'
  }

class SNPSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rsid: '',
            cell: 'hMSC',
            snps: [],
            selectedSNP: [],
            promoters: [],
            chr: '',
            pos: '',
            ref: '',
            alt: '',
            rsid_url: '',
            locus_range: '',
            locus_hic_url: '',
            locus_snp_url: '',
            encode_ccre_url: '',
            gencode_url: '',
            atac_url: '',
            dnase_url: '',
            chromHMM_url: '',
            H3k27ac_url: '',
            H3k4me3_url: '',
            H3k4me1_url: '',
            H3k9ac_url: '',
            hic: '',
            selectRowNo: null,
            showTable: false,
            snpResults: false,
            promoterResults: false,
            showIGV: false,
            multiSNP: false,
            isLoading: false,
            dataHorizontal1000G: {
                labels: ['ALL','AFR','AMR','EAS','EUR','SAS'],
                datasets: [
                    {
                        label: '1000g',
                        data: [],
                        fill: false,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            dataHorizontalgnomad: {
                labels: ['ALL','AFR','AMR','EAS','NFE','SAS'],
                datasets: [
                    {
                        label: 'gnomAD',
                        data: [],
                        fill: false,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)',
                            'rgba(54, 162, 235)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            SNPColumns: [],
        };
        // this.columns = [
        //     { dataField: "Region_Ensembl", text: "Region" },
        //     { dataField: "GeneName_ID_Ensembl", text: "Gene" },
        //     { dataField: "GeneInfo_DistNG_Ensembl", text: "Distance with Gene" },
        //     { dataField: "Promoter_like_region", text: "Promoter-Like" },
        //     { dataField: "chromHMM_E026_25", text: "ChromHMM" },
        //     { dataField: "OpenChromatin_hMSC", text: "Open Chromatin"},
        //     { dataField: "SigHiC_hMSC", text: "Sig HiC"},
        // ];
        this.PromoterColumns = [
            { dataField: "Chr", text: "Promoter"},
            { dataField: "Gene", text: "Gene" },
            { dataField: "Gene_TPM", text: "Gene(TPM)" },
            { dataField: "TSS", text: "TSS" },
            { dataField: "Transcript", text: "Transcript"},
            { dataField: "Transcript_TPM", text: "Transcript(TPM)"},
            { dataField: "HiC_Promoter_bin", text: "Hi-C Promter bin" },
            { dataField: "HiC_info", text: "Hi-C info" },
            { dataField: "OpenChromatin", text: "Open Chromatin" },
            { dataField: "ChromHMM", text: "ChromHMM"},
            { dataField: "RefTSS", text: "RefTSS"},
            { dataField: "ENCODE-cCRE-PLS", text: "ENCODE-PLS"},
        ];
        this.MultiSNPColumns = [
            { dataField: "#Chr", text: "Chr"},
            { dataField: "Start", text: "Position"},
            { dataField: "Ref", text: "Ref"},
            { dataField: "Alt", text: "Alt"},
            { dataField: "AF", text: "AF"},
        ];
        this.options = {
            paginationSize: 4,
            pageStartIndex: 0,
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true,
            paginationTotalRenderer: this.customTotal,
            disablePageTitle: true,
            
          };

        this.selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: this.handleOnSelect,
        };
        
    }

    handleOnSelect = (row, isSelect, rowIndex, e) => {
        if (isSelect) {
            console.log("rowIndex:" + rowIndex)
            this.setState({selectRowNo: rowIndex})
            //console.log(this.selectRowNo)
            //this.state.selectRowNo = 0 + rowIndex
            
            const res_generateTable = this.generateTableData(rowIndex);
            console.log("Finish generateTable:")
            console.log(res_generateTable);
            
        }
      }    
    componentDidMount() {
        console.log("componentDidMount locus_range" + this.state.locus_range)
    }
    componentDidUpdate(prevProps, prevState) {
        var regex = /^chr/;
        //if(prevState.locus_range !== this.state.locus_range && regex.test(this.state.locus_range) ) {
        if(prevState.showIGV !== this.state.showIGV){
            console.log('showIGV state has changed:' + this.state.showIGV);
            //console.log('range state has changed:' + this.state.locus_range)
            //console.log('prevState.locus_range:' + prevState.locus_range)
            
            var igvContainer = document.getElementById('igv-div');
            var igvOptions;
            if(this.state.promoterResults){
                igvOptions = {
                    genome: 'hg38', 
                    //locus: 'BRCA1'
                    //locus: "chr8:118835887-119042590",
                    locus: this.state.locus_range,
                    thickness: 2,
                    tracks: [
                        {
                            url: this.state.locus_hic_url,
                            type: "interaction",
                            format: "bedpe",
                            name: "Significant Hi-C",
                            //arcType: "proportional",
                            useScore: true,
                            arcType: "nested",
                            //color: "rgb(0,200,0)",
                            color: "blue",
                            //alpha: "0.05",
                            logScale: true,
                            showBlocks: true,
                            //max: 80,
                            //visibilityWindow: 10000000,
                            height: 150
                        },
                        // {
                        //     url: "http://localhost:3000/igv/bigwig/GH_interactions1_all.final.bb",
                        //     type: "interaction",
                        //     format: "bb",
                        //     name: "GeneHancer",
                        //     arcType: "nested",
                        //     useScore: true,
                        //     showBlocks: true,
                        //     height: 100
                        // },
                        {
                            type: "annotation",
                            format: "bed",
                            url: this.state.locus_snp_url,
                            indexURL: false,
                            name: this.state.rsid,
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ATAC_seq-hMSC_pvalue.bigwig",
                            url: this.state.atac_url,
                            height: 50,
                            name: "ATAC-seq",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/DNase_seq_hMSC.bigWig",
                            url: this.state.dnase_url,
                            height: 50,
                            name: "Dnase-seq",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/E026_25_imputed12marks_hg38lift_dense.bed",
                            url: this.state.chromHMM_url,
                            height: 50,
                            name: "ChromHMM",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF223NOV_hMSC_H3K27Ac_pvalue.bigWig",
                            url: this.state.H3k27ac_url,
                            height: 50,
                            name: "H3k27ac",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF648BRC_hMSC_H3K4me1_pvalue.bigWig",
                            url: this.state.H3k4me1_url,
                            height: 50,
                            name: "H3k4me1",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF611FKW_hMSC_H3K4me3_pvalue.bigWig",
                            url: this.state.H3k4me3_url,
                            height: 50,
                            name: "H3k4me3",
                            color: "rgb(252, 74, 3)",
                        },
                        {
                            type: "annotation",
                            format: "bb",
                            //url: "http://localhost:3000/igv/bigwig/encodeCcreCombined.bb",
                            url: this.state.encode_ccre_url,
                            height: 50,
                            name: "ENCODE-cCRE",
                            displayMode: "EXPANDED",
                        },
                        // {   
                        //     type: "wig",
                        //     format: "bigwig",
                        //     //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF757SDY_hMSC_H3K9ac_pvalue.bigWig",
                        //     url: this.state.H3k9ac_url,
                        //     height: 50,
                        //     name: "H3k9ac",
                        //     color: "rgb(252, 74, 3)",
                        // },
                        {
                            type: "annotation",
                            format: "gtf",
                            url: this.state.gencode_url,
                            indexURL: this.state.gencode_url + '.tbi',
                            //indexURL: "http://localhost:3000/igv/gencode.v35.annotation.sort.gtf.gz.tbi",
                            //displayMode: "SQUISHED",
                            displayMode: "EXPANDED",
                            name: "Gencode v35 (gtf)",
                            visibilityWindow: 10000000
                        },
                    ]
                };
            }else{
                igvOptions = {
                    genome: 'hg38', 
                    //locus: 'BRCA1'
                    //locus: "chr8:118835887-119042590",
                    locus: this.state.locus_range,
                    thickness: 2,
                    tracks: [
                        {
                            type: "annotation",
                            format: "bed",
                            url: this.state.locus_snp_url,
                            indexURL: false,
                            name: this.state.rsid,
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ATAC_seq-hMSC_pvalue.bigwig",
                            url: this.state.atac_url,
                            height: 50,
                            name: "ATAC-seq",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/DNase_seq_hMSC.bigWig",
                            url: this.state.dnase_url,
                            height: 50,
                            name: "Dnase-seq",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/E026_25_imputed12marks_hg38lift_dense.bed",
                            url: this.state.chromHMM_url,
                            height: 50,
                            name: "ChromHMM",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF223NOV_hMSC_H3K27Ac_pvalue.bigWig",
                            url: this.state.H3k27ac_url,
                            height: 50,
                            name: "H3k27ac",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF648BRC_hMSC_H3K4me1_pvalue.bigWig",
                            url: this.state.H3k4me1_url,
                            height: 50,
                            name: "H3k4me1",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            //color: "black",
                            //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF611FKW_hMSC_H3K4me3_pvalue.bigWig",
                            url: this.state.H3k4me3_url,
                            height: 50,
                            name: "H3k4me3",
                            color: "rgb(252, 74, 3)",
                        },
                        // {   
                        //     type: "wig",
                        //     format: "bigwig",
                        //     //url: "http://localhost:3000/igv/bigwig/hMSC/ENCFF757SDY_hMSC_H3K9ac_pvalue.bigWig",
                        //     url: this.state.H3k9ac_url,
                        //     height: 50,
                        //     name: "H3k9ac",
                        //     color: "rgb(252, 74, 3)",
                        // },
                        {
                            type: "annotation",
                            format: "gtf",
                            url: this.state.gencode_url,
                            indexURL: this.state.gencode_url + '.tbi',
                            //indexURL: "http://localhost:3000/igv/gencode.v35.annotation.sort.gtf.gz.tbi",
                            //displayMode: "SQUISHED",
                            displayMode: "EXPANDED",
                            name: "Gencode v35 (gtf)",
                            visibilityWindow: 10000000
                        },
                    ]
                };
            }
            
            return igv.createBrowser(igvContainer, igvOptions);

        }
    }
    
    hicProcess = async() => {
        //console.log(this.state.hic);
        let reg_bin_Re = RegExp('RegulatoryBin:(.*?);')
        let reg = reg_bin_Re.exec(this.state.hic)[1]
        console.log("reg:" + reg)
        const reg_range = reg.split(':')
        var reg_content = "chr" + this.state.chr + "\t" + reg_range[1] + "\t" + reg_range[2];
        var igv_bedpe_content;
        var start_min = parseInt(reg_range[1])
        var end_max = parseInt(reg_range[2])
        console.log('start_min:' + start_min + "; end_max:" + end_max)
        var promoter_api_url;
        if(this.state.cell === "hMSC"){
            promoter_api_url = process.env.REACT_APP_EXPRESS_URL + '/promoterhMSC/' + reg.replaceAll(':', '%3A');
            //promoter_api_url = "http://localhost:5000/promoterhMSC/" + reg.replaceAll(':', '%3A');
        }else if(this.state.cell === "Osteoblast"){
            //promoter_api_url = "http://localhost:5000/promoterOB/" + reg.replaceAll(':', '%3A');
            promoter_api_url = process.env.REACT_APP_EXPRESS_URL + '/promoterOB/' + reg.replaceAll(':', '%3A');
        }else{
            //promoter_api_url = "http://localhost:5000/promoterOC/" + reg.replaceAll(':', '%3A');
            promoter_api_url = process.env.REACT_APP_EXPRESS_URL + '/promoterOC/' + reg.replaceAll(':', '%3A');
        }
        console.log(promoter_api_url);
        try{
            const res_promoter = await axios.get(promoter_api_url);
            console.log(res_promoter.data)
            var promoter_update = res_promoter.data
            for(var i=0;i<promoter_update.length;i++){
                const hicPromoterBin = promoter_update[i].HiC_Promoter_bin.split(':')
                const hicPromoterBinChr = hicPromoterBin[0];
                const hicPromoterBinStart = hicPromoterBin[1];
                const hicPromoterBinEnd = hicPromoterBin[2];
                console.log(hicPromoterBinChr)
                console.log(hicPromoterBinStart)
                console.log(hicPromoterBinEnd)
                if(promoter_update[i].Start < start_min){
                //if(hicPromoterBinStart < start_min){
                    start_min = hicPromoterBinStart
                }
                if(hicPromoterBinEnd > end_max){
                    end_max = hicPromoterBinEnd
                }
                var each_interaction = reg_content + "\t" + promoter_update[i].Chr + "\t" + promoter_update[i].Start + "\t" + promoter_update[i].End + "\t10\n";
                //var each_interaction = reg_content + "\t" + hicPromoterBinChr + "\t" + hicPromoterBinStart + "\t" + hicPromoterBinEnd + "\t10\n";
                if(igv_bedpe_content == null){
                    igv_bedpe_content = each_interaction
                }else{
                    igv_bedpe_content += each_interaction
                }
                
                //console.log('each_interaction:' + each_interaction)
                promoter_update[i].Chr = promoter_update[i].Chr + ":" + promoter_update[i].Start + "-" + promoter_update[i].End
                //console.log('promoter:' + promoter_update[i].Chr)
            }
            //console.log('start_min:' + start_min + "; end_max:" + end_max)
            //console.log(igv_bedpe_content)
            this.setState({
                
                //locus_hic_url: "http://localhost:3000/igv/" + this.state.rsid + "_" + this.state.cell + ".bedpe.txt",
                locus_hic_url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.rsid + "_" + this.state.cell + ".bedpe.txt",
                promoters: res_promoter.data,
                promoterResults: true
            })
            //const response = await fetch('http://localhost:5000/writeFile',{
            const response = await fetch(process.env.REACT_APP_EXPRESS_URL + '/writeFile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "interaction",
                    cell: this.state.cell,
                    rsid: this.state.rsid,
                    content: igv_bedpe_content,
                }),
            });
            const writeRes = await response.text();
            console.log("write file:")
            console.log(writeRes)

            var final_render_sigHiC = this.state.hic.replaceAll(';', '\n');
            final_render_sigHiC = final_render_sigHiC.replaceAll('RegulatoryBin:', 'RegulatoryBin\n')
            final_render_sigHiC = final_render_sigHiC.replaceAll('RegulatoryBin:', 'RegulatoryBin\n')
            final_render_sigHiC = final_render_sigHiC.replaceAll(',', '\n')
            console.log("clean hic:" + final_render_sigHiC)
            var start_pos = parseInt(start_min) - 10000
            var end_pos = parseInt(end_max) + 10000
            if (start_pos < 0){
                start_pos = 0
            }
            this.setState({ locus_range: "chr" + this.state.chr + ":" + start_pos + "-" + end_pos})
            console.log("locus_range:" + this.state.locus_range)
        } catch (error) {
            console.log(error);
        }
        return "hicProcess finished";
        
    };
    generateTableData = async (index) => {
        var annotation = this.state.snps[index];
        var anno_json = [...this.state.snps];
        console.log('APP_URL:')
        
        //console.log("origin anno_json:" + JSON.stringify(anno_json))
        var arr = [];
        for(var i=0; i< this.state.snps.length; i++){
            if(i == index){
                arr.push(anno_json[i])
            }
        }
        //console.log("selectRowNo:" + this.state.selectRowNo)
        console.log(arr)
        //var arr = JSON.parse(JSON.stringify(anno_json));
        //console.log("arr:" + arr)
        this.setState({ selectedSNP: arr})

        console.log("Alt:" + annotation.Alt)
        var dataHorizontal1000G_update = {...this.state.dataHorizontal1000G};
        var dataHorizontalgnomad_update = {...this.state.dataHorizontalgnomad};
        var AF_1000G = [annotation["1000g_ALL"],annotation["1000g_AFR"],annotation["1000g_AMR"],annotation["1000g_EAS"],annotation["1000g_EUR"],annotation["1000g_SAS"]];
        var AF_gnomad = [annotation.gnomAD_All,annotation.gnomAD_AFR,annotation.gnomAD_AMR,annotation.gnomAD_EAS,annotation.gnomAD_NFE,annotation.gnomAD_SAS];
        dataHorizontal1000G_update.datasets[0].data = AF_1000G;
        dataHorizontalgnomad_update.datasets[0].data = AF_gnomad;
        dataHorizontalgnomad_update.datasets[0].label = "gnomAD";
        var rsidURL = "https://www.ncbi.nlm.nih.gov/snp/" + this.state.rsid;
        //var rsidURL_igv = "http://localhost:3000/igv/" + this.state.rsid + ".bed";
        //var rsidURL_igv = process.env.REACT_APP_BASE_URL + "/igv/" + this.state.rsid + ".bed";
        this.setState({
            chr: annotation["#Chr"],
            pos: annotation.Start,
            ref: annotation.Ref,
            alt: annotation.Alt,
            rsid_url: "https://www.ncbi.nlm.nih.gov/snp/" + this.state.rsid,
            encode_ccre_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/encodeCcreCombined.bb',
            gencode_url: process.env.REACT_APP_BASE_URL + '/igv/gencode.v35.annotation.sort.gtf.gz',
            locus_snp_url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.rsid + ".bed",
            dataHorizontal1000G: dataHorizontal1000G_update,
            dataHorizontalgnomad: dataHorizontalgnomad_update,
        })
            
            
        const response = await fetch(process.env.REACT_APP_EXPRESS_URL + '/writeFile',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "snp",
                post: this.state.rsid,
                range: "chr" + annotation["#Chr"] + "\t" + annotation.Start + "\t" + annotation.Start + "\t" + this.state.rsid,
            }),
        });
        const writeRes = await response.text();
        console.log("write SNP file:")
        console.log(writeRes)
        
        //const body = await response.text();

        //set cell-type specific annotation below

        if (this.state.cell === "hMSC") {
            console.log("hMSC cell-type processing...")
            var columns_update = [
                { dataField: "Region_Ensembl", text: "Region" },
                { dataField: "GeneName_ID_Ensembl", text: "Gene" },
                { dataField: "GeneInfo_DistNG_Ensembl", text: "Distance with Gene" },
                { dataField: "Promoter_like_region", text: "Promoter-Like" },
                { dataField: "chromHMM_E026_25", text: "ChromHMM" },
                { dataField: "OpenChromatin_hMSC", text: "Open Chromatin"},
                { dataField: "SigHiC_hMSC", text: "Sig Hi-C"},
            ]
            this.setState({
                SNPColumns: columns_update,
                atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ATAC_seq-hMSC_pvalue.bigwig',
                dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/DNase_seq_hMSC.bigWig',
                chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/E026_25_imputed12marks_hg38lift_dense.bed',
                H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF223NOV_hMSC_H3K27Ac_pvalue.bigWig',
                H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF611FKW_hMSC_H3K4me3_pvalue.bigWig',
                H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF648BRC_hMSC_H3K4me1_pvalue.bigWig',
                H3k9ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF757SDY_hMSC_H3K9ac_pvalue.bigWig',
            })
            
            //console.log("sigHiC:" + annotation.SigHiC_hMSC)
            
            if(annotation.SigHiC_hMSC){
                this.setState({hic: annotation.SigHiC_hMSC});
                //this.hicProcess();
                const hicProcess_res = await this.hicProcess();
                console.log("hicProcess_res:")
                console.log(hicProcess_res);
            }else{
                this.setState({ promoterResults: false})
            }
            
        }else if(this.state.cell === "Osteoblast"){
            console.log("Osteoblast cell-type processing...")
            var columns_update = [
                { dataField: "Region_Ensembl", text: "Region" },
                { dataField: "GeneName_ID_Ensembl", text: "Gene" },
                { dataField: "GeneInfo_DistNG_Ensembl", text: "Distance with Gene" },
                { dataField: "Promoter_like_region", text: "Promoter-Like" },
                { dataField: "chromHMM_E129_25", text: "ChromHMM" },
                { dataField: "OpenChromatin_OB", text: "Open Chromatin"},
                { dataField: "SigHiC_OB13", text: "Sig Hi-C"},
            ]
            this.setState({
                SNPColumns: columns_update,
                atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ATAC_seq-osteoblast_pvalue.bigWig',
                dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/DNase_seq_osteoblast.bigWig',
                chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/E129_25_imputed12marks_hg38lift_dense.bed',
                H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF048BRN_H3K27ac_OB_p-value.bigWig',
                H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF327MED_ H3K4me3_OB_pvalue.bigWig',
                H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF103BYE_H3K4me1_OB_pvalue.bigWig',
                H3k9ac_url: '',
            })
            if(annotation.SigHiC_OB13){
                this.setState({hic: annotation.SigHiC_OB13});
                //this.hicProcess();
                const hicProcess_res = await this.hicProcess();
                console.log("hicProcess_res:")
                console.log(hicProcess_res);
            }else{
                this.setState({ promoterResults: false})
            }
        }else{
            console.log("Osteocyte cell-type processing...")
            var columns_update = [
                { dataField: "Region_Ensembl", text: "Region" },
                { dataField: "GeneName_ID_Ensembl", text: "Gene" },
                { dataField: "GeneInfo_DistNG_Ensembl", text: "Distance with Gene" },
                { dataField: "Promoter_like_region", text: "Promoter-Like" },
                { dataField: "chromHMM_E129_25", text: "ChromHMM" },
                { dataField: "OpenChromatin_OB", text: "Open Chromatin"},
                { dataField: "SigHiC_OC", text: "Sig Hi-C"},
            ]
            this.setState({SNPColumns: columns_update})
            //var sigHiC = anno.SigHiC_OC
            if(annotation.SigHiC_OC){
                this.setState({hic: annotation.SigHiC_OC});
                //this.hicProcess();
                const hicProcess_res = await this.hicProcess();
                console.log("hicProcess_res:")
                console.log(hicProcess_res);
            }else{
                this.setState({ promoterResults: false})
            }
        }
        if(this.state.promoterResults == false){
            var start_pos = parseInt(this.state.pos) - 10000
            var end_pos = parseInt(this.state.pos) + 10000
            if (start_pos < 0){
                start_pos = 0
            }
            this.setState({ locus_range: "chr" + this.state.chr + ":" + start_pos + "-" + end_pos})
            console.log("locus_range:" + this.state.locus_range)
        }
        this.setState({ 
            showTable: true,
            snpResults: true,
            showIGV: true,
            isLoading: false
        })
        return "Finish generateTable";
    };
    

    getSNPData = async () => {
        try{
          //alert(trait_name)
          //console.log(this.state.trait_name);
          //var snp_url = "http://localhost:5000/snp/" + this.state.rsid;
          var snp_url = process.env.REACT_APP_EXPRESS_URL + "/snp/" + this.state.rsid;
          console.log(snp_url);
          const res = await axios.get(snp_url);
          console.log(res.data);
          console.log("type of data:" + typeof res.data)
          if(!res.data.length) {
            this.setState({
                snpResults: false,
                showTable: true,
            })
          }else if (res.data.length > 1){ // multiple SNPs within this rsID
            console.log("Multiple SNP:" + res.data.length);
            this.setState({
                snps: res.data,
                multiSNP: true,
            })
            
          }else { //only on SNP within this rsID
            //var index = 0
            this.setState({
                snps: res.data,
            })
            const res_generateTable = await this.generateTableData(0);
            console.log("res_generateTable:")
            console.log(res_generateTable);
            
            
          }
          
           
        } catch (e) {
            console.log(e)
        }
    };
    
    handleChangeSNP = (event) => {
        this.setState({ rsid : event.target.value });
    }
    handleChangeCell = (event) => {
        this.setState({ cell : event.target.value });
    }

    handleSubmit = (event) => {
        console.log(this.state.rsid);
        console.log(this.state.cell);
        this.setState({
            showTable: false,
            snpResults: false,
            promoterResults: false,
            showIGV: false,
            multiSNP: false,
            isLoading: true,
        })
        igv.removeAllBrowsers()
        this.getSNPData();
        //alert('A name was submitted: ' + this.state.rsid);
        
        event.preventDefault();
    }
    render() {
        //const igv_ele = this.getIGV();
        return (
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">SNP</CardTitle>
                            </CardHeader>
                            
                            <CardBody>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup className="no-border"> 
                                        <Input 
                                            type="text" 
                                            value={this.state.rsid} 
                                            placeholder="Search SNP (rsID)..." 
                                            onChange={this.handleChangeSNP}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="SelectCellType">Select Cell-Type</Label>
                                        <Input type="select" value={this.state.cell} placeholder="select cell-type" onChange={this.handleChangeCell}>
                                            <option>hMSC</option>
                                            <option>Osteoblast</option>
                                            <option>Osteocyte</option>
                                        </Input>
                                    </FormGroup>
                                    <Button>Submit</Button>
                                    
                                    
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    {/* {(this.state.showTable && this.state.snpResults && this.state.promoterResults) */}
                    {/* {(this.state.snpResults && this.state.promoterResults) */}
                    {(this.state.multiSNP === true)
                        ? <Col md="12">
                            <Card>
                                <CardHeader>
                                <CardTitle tag="h4">{this.state.rsid} has multiple SNPs</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className="content">
                                        <BootstrapTable
                                            keyField="_id"
                                            data={this.state.snps}
                                            columns={this.MultiSNPColumns}
                                            //selectRow={this.onSelect}
                                            selectRow={this.selectRow }
                                            striped
                                            hover
                                            condensed
                                        />       
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        : null
                    }
                    
                    { (this.state.snpResults)
                        ? <Col md="2">
                            <Card className="content">
                                
                                <CardBody>
                                    <h5>
                                    Chr: {this.state.chr} 
                                    </h5>
                                    <h5>
                                    Pos: {this.state.pos} 
                                    </h5>
                                    <h5>
                                    Ref: {this.state.ref} 
                                    </h5>
                                    <h5>
                                    Alt: {this.state.alt} 
                                    </h5>
                                    <h5>
                                        rsID:
                                        <a
                                        href={this.state.rsid_url} 
                                        target="_blank"
                                        >
                                        {this.state.rsid}
                                        </a>
                                    </h5>
                                </CardBody>
                                
                            </Card>
                        </Col>
                        : null
                    }
                    { (this.state.snpResults)
                        ? <Col md="5">
                            <Card className="content">
                                <CardBody>
                                    <MDBContainer>
                                        <HorizontalBar
                                            data={this.state.dataHorizontal1000G}
                                            options={{ responsive: true }}
                                        />
                                    </MDBContainer>
                                </CardBody>
                            </Card>
                        </Col>
                        : null
                    }
                    { (this.state.snpResults)
                        ? <Col md="5">
                            <Card className="content">
                                <CardBody>
                                    <MDBContainer>
                                        <HorizontalBar
                                            data={this.state.dataHorizontalgnomad}
                                            options={{ responsive: true }}
                                        />
                                    </MDBContainer>
                                </CardBody>
                            </Card>
                        </Col>
                        : null
                    }
                    {(this.state.snpResults && this.state.showIGV)
                        ? <Col md="12">
                            <Card>
                                <CardHeader>
                                <CardTitle tag="h4">{this.state.rsid}'s IGV in {this.state.cell} cell-type</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div id="igv-div" style={igvStyle}></div>
                                </CardBody>
                            </Card>
                        </Col>
                        : null
                    }
                    {/* { (this.state.showTable && this.state.snpResults) */}
                    { (this.state.snpResults && !this.state.isLoading)
                        ?    
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">{this.state.rsid} in {this.state.cell} cell-type</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                    <div className="SNPTable">
                                        <BootstrapTable
                                            keyField="_id"
                                            //data={this.state.snps}
                                            data={this.state.selectedSNP}
                                            columns={this.state.SNPColumns}
                                            striped
                                            hover
                                            condensed
                                            //pagination={paginationFactory()}
                                        />       
                                    </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        : (this.state.snpResults === false && this.state.showTable === true) ? 
                                <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">Can't find any {this.state.rsid} relevant SNPs</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Col>
                        : (this.state.isLoading) ? 
                            <Col md="12">
                                <Loader type="spin" />
                            </Col>
                        : null 
                    }
                    {/* { (this.state.showTable && this.state.snpResults && this.state.promoterResults) */}
                    { (this.state.snpResults && this.state.promoterResults && !this.state.isLoading)
                        ? <Col md="12">
                            <Card>
                                <CardHeader>
                                <CardTitle tag="h4">{this.state.rsid}'s Hi-C interactions in {this.state.cell} cell-type</CardTitle>
                                </CardHeader>
                                <CardBody>
                                <div className="content">
                                    <BootstrapTable
                                        keyField="_id"
                                        data={this.state.promoters}
                                        columns={this.PromoterColumns}
                                        striped
                                        hover
                                        condensed
                                        pagination={paginationFactory()}
                                    />       
                                </div>
                                </CardBody>
                            </Card>
                        </Col>
                        // : (this.state.isLoading) ? 
                        // <Col md="12">
                        //     <Loader type="spin" />
                        // </Col>
                        : null
                    }
                    
                        
                </Row>
            </div>
        );
    }
}


export default SNPSearch;