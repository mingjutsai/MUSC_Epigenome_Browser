import React, { Fragment } from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
//import {Typeahead} from 'react-bootstrap-typeahead';
import { Hint } from 'react-autocomplete-hint';
import { AutoComplete } from "@react-md/autocomplete";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Loader } from '../../vibe/';
import igv from 'igv';
//import LocusZoom from 'locuszoom';
//import 'locuszoom/dist/locuszoom.css';


// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Input,
    Form,
    Button,
    FormGroup,
    Label,
  } from "reactstrap";
var igvStyle = {
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: '8px',
    border: '1px solid lightgray'
}
class DiseaseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trait_name: '',
            cell: 'hMSC',
            snps: [],
            rsid: '',
            ldrsid: '',
            ldvariant: '',
            //datarange: '',
            ldsnps: [],
            indexSNPChr: '',
            indexSNPPos: '',
            indexSNP: '',
            selectLDSNP: [],
            hintData: [],
            locus_range: '',
            locus_snp_url: '',
            locus_hic_url: '',
            atac_url: '',
            dnase_url: '',
            chromHMM_url: '',
            H3k27ac_url: '',
            H3k4me3_url: '',
            H3k4me1_url: '',
            r_cutoff: 0.7,
            hicTrack: false,
            getLDData: false,
            showTable: false,
            showLDPlot: false,
            snpResults: true,
            showLDTable: false,
            showIGV: false,
            options: [],
            isLoading: false,
            isLoadingLD: false,
            selectDisease: [],
            caseSensitive: false,
            ignoreDiacritics: true,
            modal: false,
        };
        this.columns = [
            { dataField: "RSID", text: "SNP ID", formatter: this.SNP_hyperlink },
            // { dataField: "#Chr", text: "Chr" },
            { dataField: "VariantID", text: "Variant ID"},
            { dataField: "risk_allele", text: "Risk allele" },
            { dataField: "risk_allele_freq", text: "Risk allele AF" },
            { dataField: "pubmed", text: "Pubmed", formatter: this.hyperLink },
            { dataField: "mapped_gene", text: "Mapped gene" },
            { dataField: "reported_gene", text: "Reported gene" },
            { dataField: "pvalue", text: "P-value", sort: true },
            { dataField: "study_accession", text: "Study ID", formatter: this.GCST_hyperlink },
        ];
        this.LD_columns = [
            { dataField: "Variant", text: "Chr:Pos:Ref/Alt" },
            { dataField: "RSID", text: "RSID" },
            { dataField: "R_square", text: "r2", sort:true},
            { dataField: "BETA_GEFOS2018_Bmd", text: "Beta eBMD"},
            { dataField: "SE_GEFOS2018_Bmd", text: "SE eBMD"},
            { dataField: "P_GEFOS2018_Bmd", text: "P-value eBMD", sort: true},
            { dataField: "OR_GEFOS2018_FracA", text: "OR FracA"},
            { dataField: "P_GEFOS2018_FracA", text: "P-value FracA", sort: true},
            { dataField: "FNBMD_Effect", text: "Effect FNBMD" },
            { dataField: "FNBMD_pvalue", text: "P-value FNBMD", sort: true},
            { dataField: "LSBMD_Effect", text: "Effect LSBMD" },
            { dataField: "LSBMD_pvalue", text: "P-value LSBMD", sort: true},
            //{ dataField: "SigHiC_OB13", text: "SigHiC_OB13"}
        ];
        this.options = {
            paginationSize: 4,
            pageStartIndex: 0,
            alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
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
            style: { backgroundColor: '#c8e6c9' },
            onSelect: this.handleOnSelectROW,
        };
        this.selectIndexSNP = {
            mode: 'radio',
            clickToSelect: true,
            style: { backgroundColor: '#c8e6c9' },
            onSelect: this.handleOnModalsIndexSNP,
        }
        this.selectSNP = {
            mode: 'radio',
            clickToSelect: true,
            style: { backgroundColor: '#c8e6c9' },
            //onSelect: this.toggle,
            //onSelect: this.handleOnModals,
            onSelect: this.SNPDetail,
        }
        //this.toggle = this.toggle.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("isLoadingLD state" + this.state.isLoadingLD)
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.showLDTable && prevState.showIGV !== this.state.showIGV){
        //if(this.state.showLDTable && prevState.indexSNP != this.state.indexSNP){
            //console.log('indexSNP state has changed:' + this.state.indexSNP);
            
            var igvContainer = document.getElementById('igv-div');
            var igvOptions;
            if(this.state.hicTrack){
                igvOptions = {
                    genome: 'hg38', 
                    //locus: 'BRCA1'
                    //locus: "chr8:118835887-119042590",
                    locus: this.state.locus_range,
                    thickness: 5,
                    roi: [
                        {
                            name: this.state.rsid,
                            url: this.state.locus_snp_url,
                            indexed: false,
                            color: "rgba(68, 134, 247, 0.25)"
                        }
                    ],
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
                        {
                            type: "annotation",
                            format: "bed",
                            url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.indexSNP + "_LD.bed",
                            height: 50,
                            name: "LD SNP",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            url: process.env.REACT_APP_BASE_URL + "/igv/promoter_like_regions_annotation_sorted.bed",
                            height: 50,
                            name: "Promoter-like-region",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "bb",
                            url: process.env.REACT_APP_BASE_URL + "/igv/bigwig/encodeCcreCombined.bb",
                            height: 50,
                            name: "ENCODE-cCRE",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "gtf",
                            url: process.env.REACT_APP_BASE_URL + "/igv/gencode.v35.annotation.sort.gtf.gz",
                            indexURL: process.env.REACT_APP_BASE_URL + "/igv/gencode.v35.annotation.sort.gtf.gz.tbi",
                            //displayMode: "SQUISHED",
                            displayMode: "EXPANDED",
                            name: "Gencode v35 (gtf)",
                            visibilityWindow: 10000000,
                            height: 100,
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.atac_url,
                            height: 50,
                            name: "ATAC-seq",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.dnase_url,
                            height: 50,
                            name: "Dnase-seq",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            url: this.state.chromHMM_url,
                            height: 50,
                            name: "ChromHMM",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k27ac_url,
                            height: 50,
                            name: "H3k27ac",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k4me1_url,
                            height: 50,
                            name: "H3k4me1",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k4me3_url,
                            height: 50,
                            name: "H3k4me3",
                            color: "rgb(252, 74, 3)",
                        },
                        
                        
                    ]
                };
            }else{
                igvOptions = {
                    genome: 'hg38', 
                    //locus: 'BRCA1'
                    //locus: "chr8:118835887-119042590",
                    locus: this.state.locus_range,
                    thickness: 5,
                    roi: [
                        {
                            name: this.state.rsid,
                            url: this.state.locus_snp_url,
                            indexed: false,
                            color: "rgba(68, 134, 247, 0.25)"
                        }
                    ],
                    tracks: [
                        {
                            type: "annotation",
                            format: "bed",
                            url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.indexSNP + "_LD.bed",
                            height: 50,
                            name: "LD SNP",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            url: process.env.REACT_APP_BASE_URL + "/igv/promoter_like_regions_annotation_sorted.bed",
                            height: 50,
                            name: "Promoter-like-region",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "bb",
                            url: process.env.REACT_APP_BASE_URL + "/igv/bigwig/encodeCcreCombined.bb",
                            height: 50,
                            name: "ENCODE-cCRE",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "gtf",
                            url: process.env.REACT_APP_BASE_URL + "/igv/gencode.v35.annotation.sort.gtf.gz",
                            indexURL: process.env.REACT_APP_BASE_URL + "/igv/gencode.v35.annotation.sort.gtf.gz.tbi",
                            //displayMode: "SQUISHED",
                            displayMode: "EXPANDED",
                            name: "Gencode v35 (gtf)",
                            visibilityWindow: 10000000,
                            height: 100,
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.atac_url,
                            height: 50,
                            name: "ATAC-seq",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.dnase_url,
                            height: 50,
                            name: "Dnase-seq",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            url: this.state.chromHMM_url,
                            height: 50,
                            name: "ChromHMM",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k27ac_url,
                            height: 50,
                            name: "H3k27ac",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k4me1_url,
                            height: 50,
                            name: "H3k4me1",
                            color: "rgb(252, 202, 3)",
                        },
                        {
                            type: "wig",
                            format: "bigwig",
                            url: this.state.H3k4me3_url,
                            height: 50,
                            name: "H3k4me3",
                            color: "rgb(252, 74, 3)",
                        },
                        {
                            type: "annotation",
                            format: "bed",
                            url: process.env.REACT_APP_BASE_URL + "/igv/promoter_like_regions_annotation_sorted.bed",
                            height: 50,
                            name: "Promoter-like-region",
                            displayMode: "EXPANDED",
                        },
                        {
                            type: "annotation",
                            format: "bb",
                            url: process.env.REACT_APP_BASE_URL + "/igv/bigwig/encodeCcreCombined.bb",
                            height: 50,
                            name: "ENCODE-cCRE",
                            displayMode: "EXPANDED",
                        },
                    ]
                };
            }
            
            return igv.createBrowser(igvContainer, igvOptions);

        }
    }
    handleOnModalsIndexSNP = (row, isSelect, rowIndex, e) => {
        //console.log(row)
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        //const chr = row["#Chr"];
        const chr = row.Chr;
        //const pos = row.Start;
        const pos = row.Pos;
        const ref = row.Ref;
        const alt = row.Alt;
        const index_snp = chr + "_" + pos + "_" + ref + "_" + alt;
        const id = row.RSID;
        //console.log("indexSNP:")
        //console.log(index_snp)
        if(index_snp !== this.state.indexSNP){
            this.setState({
                rsid: id,
                indexSNPChr: chr,
                indexSNPPos: pos,
                indexSNP: index_snp,
                //datarange: range_plot,
                locus_snp_url: process.env.REACT_APP_BASE_URL + "/igv/" + id + ".bed",
                isLoadingLD: true,
                showIGV: false,
                showLDTable: false,
            })
            //const res_generateTable = this.generateTableData(index_snp);
            //console.log(res_generateTable);
        }else{
            //console.log("get the same indexSNP:" + index_snp)
        }
    }
    handleOnModals = (row, isSelect, rowIndex, e) => {
        //console.log(row)
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        const id = row.RSID;
        var variantID = row.Variant;
        const variant_tmp = variantID.split(':');
        const chr = variant_tmp[0]
        const pos = variant_tmp[1]
        const allele = variant_tmp[2].split('/')
        const ref = allele[0]
        const alt = allele[1]
        variantID = chr + "_" + pos + "_" + ref + "_" + alt
        //console.log(variantID)
        this.setState({
            //selectLDSNP: row,
            ldrsid: id,
            ldvariant: variantID,
        })

    }
    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    handleOnSelectROW = (row, isSelect, rowIndex, e) => {
        if (isSelect) {
            //console.log("rowIndex:" + rowIndex)
            //console.log(rowIndex)
            //console.log(row)
            const chr = row["#Chr"];
            const pos = row.Start;
            const ref = row.Ref;
            const alt = row.Alt;
            const index_snp = chr + "_" + pos + "_" + ref + "_" + alt;
            const id = row.RSID;
            // const range_start = pos - 250000;
            // const range_end = pos + 250000;
            // const range_plot = chr + ":" + range_start + "-" + range_end;
            if(index_snp !== this.state.indexSNP){
                this.setState({
                    rsid: id,
                    indexSNPChr: chr,
                    indexSNPPos: pos,
                    //indexSNP: index_snp,
                    //datarange: range_plot,
                    locus_snp_url: process.env.REACT_APP_BASE_URL + "/igv/" + id + ".bed",
                    isLoadingLD: true,
                    //showIGV: false,
                    showLDTable: false,
                })
                const res_generateTable = this.generateTableData(index_snp);
                //console.log(res_generateTable);
            }else{
                //console.log("get the same indexSNP:" + index_snp)
            }
            
        }
    }
    generateTableData = async (index_snp) => {
        const ld_url = process.env.REACT_APP_EXPRESS_URL + "/gwasLD/" + index_snp;
        // console.log(ld_url);
        const res = await axios.get(ld_url);
        var LDfiltered = [];
        if(res.data.length == 0){
            this.setState({
                isLoadingLD: false,
                getLDData: false,
                showLDTable: true,
            });
        }else{
            var igv_bed_content = "rack itemRgb=On\n";
            //var start_min = 1000000000000000;
            //var end_max = 0;
            var index_rsid;
            
            var filter_no = 0;
            var has_hic = false;
            var igv_bedpe_content;
            var start_min = 1000000000
            var end_max = 0
            for(var i=0;i<res.data.length;i++){
                var variant = res.data[i].Variant.split(':');
                var variant_chr = variant[0]
                var variant_pos = variant[1]
                var rsquare = res.data[i].R_square
                var hic;
                if(rsquare < this.state.r_cutoff){
                    continue;
                }
                if(this.state.cell === "hMSC"){
                    if(res.data[i].SigHiC_hMSC){
                        hic = res.data[i].SigHiC_hMSC;
                        has_hic = true;
                    }
                    this.setState({
                        atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ATAC_seq-hMSC_pvalue.bigwig',
                        dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/DNase_seq_hMSC.bigWig',
                        chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/E026_25_imputed12marks_hg38lift_dense.bed',
                        H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF223NOV_hMSC_H3K27Ac_pvalue.bigWig',
                        H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF611FKW_hMSC_H3K4me3_pvalue.bigWig',
                        H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF648BRC_hMSC_H3K4me1_pvalue.bigWig',
                    })
                }else if(this.state.cell === "Osteoblast"){
                    if(res.data[i].SigHiC_OB13){
                        hic = res.data[i].SigHiC_OB13;
                        has_hic = true;
                    }
                    this.setState({
                        atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ATAC_seq-osteoblast_pvalue.bigWig',
                        dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/DNase_seq_osteoblast.bigWig',
                        chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/E129_25_imputed12marks_hg38lift_dense.bed',
                        H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF048BRN_H3K27ac_OB_p-value.bigWig',
                        H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF327MED_ H3K4me3_OB_pvalue.bigWig',
                        H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF103BYE_H3K4me1_OB_pvalue.bigWig',
                    })
                }else{
                    if(res.data[i].SigHiC_OC){
                        hic = res.data[i].SigHiC_OC;
                        has_hic = true;
                    }
                    this.setState({
                        atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ATAC_seq-osteoblast_pvalue.bigWig',
                        dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/DNase_seq_osteoblast.bigWig',
                        chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/E129_25_imputed12marks_hg38lift_dense.bed',
                        H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF048BRN_H3K27ac_OB_p-value.bigWig',
                        H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF327MED_ H3K4me3_OB_pvalue.bigWig',
                        H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF103BYE_H3K4me1_OB_pvalue.bigWig',
                    })
                }
                if(hic){
                    let reg_bin_Re = RegExp('RegulatoryBin:(.*?);')
                    let reg = reg_bin_Re.exec(hic)[1]
                    // console.log("reg:" + reg)
                    const reg_range = reg.split(':')
                    if(reg_range[1] < start_min){
                        start_min = parseInt(reg_range[1])
                    }
                    if(reg_range[2] > end_max){
                        end_max = parseInt(reg_range[2])
                    }

                    //var reg_content = "chr" + reg_range[0] + "\t" + reg_range[1] + "\t" + reg_range[2];
                    var reg_content = "chr" + reg_range[0] + "\t" + variant_pos + "\t" + variant_pos;
                    
                    // console.log(reg_content)
                    var promoter = hic.split('PromoterBin:')
                    var promoter_bin = promoter[1].split(',')
                    for(var p=0;p<promoter_bin.length;p++){
                        const prom_range = promoter_bin[p].split(':')
                        var prom_content = "chr" + prom_range[0] + "\t" + prom_range[1] + "\t" + prom_range[2];
                        if(prom_range[1] < start_min){
                            start_min = parseInt(prom_range[1])
                        }
                        if(prom_range[2] > end_max){
                            end_max = parseInt(prom_range[2])
                        }
                        if(igv_bedpe_content == null){
                            igv_bedpe_content = reg_content + "\t" + prom_content + "\n";
                        }else{
                            igv_bedpe_content += reg_content + "\t" + prom_content + "\n";
                        }
                        
                    }
                    
                    
                }
                
                LDfiltered[filter_no] = res.data[i];
                filter_no++;
                var rgb;
                if(rsquare == 1){
                    rgb = "127,0,255";
                    index_rsid = res.data[i].RSID;
                }else if(rsquare >= 0.8 && rsquare < 1){
                    rgb = "255,0,5";
                }else if(rsquare < 0.8 && rsquare >= 0.6){
                    rgb = "255,153,51";
                }else if(rsquare < 0.6 && rsquare >= 0.4){
                    rgb = "102,204,0";
                }else if(rsquare < 0.4 && rsquare >= 0.2){
                    rgb = "153,204,255";
                }else if(rsquare < 0.2 && rsquare >=0){
                    continue;
                }
                var variant_rsid = res.data[i].RSID
                // if(variant_pos < start_min){
                //     start_min = variant_pos
                // }
                // if(variant_pos > end_max){
                //     end_max = variant_pos
                // }
                igv_bed_content += "chr" +  variant_chr + "\t" + variant_pos + "\t" + variant_pos + "\t" + variant_rsid + "\t" + rsquare + "\t+\t" + variant_pos + "\t" + variant_pos + "\t" + rgb + "\n";
            }
            if(has_hic){
                this.setState({
                    locus_hic_url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.rsid + "_" + this.state.cell + ".bedpe.txt",
                    hicTrack: true,
                })
                // console.log("igv_bedpe_content:")
                // console.log(igv_bedpe_content)
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
                // console.log("write file:")
                // console.log(writeRes)
            }
            
            // console.log("LDfiltered:")
            // console.log(LDfiltered)
            var index_info = index_snp.split('_');
            const index_chr = index_info[0];
            const index_pos = index_info[1];
            const responseSNP = await fetch(process.env.REACT_APP_EXPRESS_URL + '/writeFile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "snp",
                    post: index_rsid,
                    range: "chr" + index_chr + "\t" + index_pos + "\t" + index_pos + "\t" + index_rsid,
                }),
            });
            const writeSNPRes = await responseSNP.text();
            // console.log("write file:")
            // console.log(writeSNPRes)
            //console.log("igv_bed_content:")
            //console.log(igv_bed_content)
            const responseLD = await fetch(process.env.REACT_APP_EXPRESS_URL + '/writeFile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "LD",
                    indexSNP: index_snp,
                    content: igv_bed_content,
                }),
            });
            const writeLDRes = await responseLD.text();
            // console.log("write file:")
            // console.log(writeLDRes)
            // var start_pos = parseInt(start_min) - 10
            // var end_pos = parseInt(end_max) + 10
            
            // if (start_pos < 0){
            //     start_pos = 0
            // }
            var start_pos;
            var end_pos;
            if(has_hic){
                start_pos = parseInt(start_min) - 10000
                end_pos = parseInt(end_max) + 10000
                if (start_pos < 0){
                    start_pos = 0
                }
            }else{
                start_pos = parseInt(this.state.indexSNPPos) - 50000;
                end_pos = parseInt(this.state.indexSNPPos) + 50000;
            }
            this.setState({
                //ldsnps: res.data,
                ldsnps: LDfiltered,
                locus_range: "chr" + this.state.indexSNPChr + ":" + start_pos + "-" + end_pos,
                showLDTable: true,
                getLDData: true,
                isLoadingLD: false,
                showIGV: true,
                //: true,
                //indexSNP: index_snp,
            });
        }
        
        return "Finish generateTable";
    }
    getTrait = async () => {
        try{
            const res = await axios.get(process.env.REACT_APP_EXPRESS_URL + '/disease/')
            //console.log(res.data);
            var hintArray = []
            // res.data.map(a => hintArray.push(a.Disease_trait))
            // //console.log(hintArray)
            // this.setState({hintData: hintArray})
            const searchResults = res.data.map((i,no) => ({
                id: no,
                name: i.Disease_trait,
            }));
            //console.log(searchResults)
            this.setState({
                options: searchResults,
                isLoading: false
            })
            
            //var hintArray = [];
            //res.data.map(a => hintArray.push(a.name));
        } catch (e) {
            console.log(e)
        }
    }
    logValue = value => {
        console.log(value);
    };
    getSNPData = async (term) => {
        try{
          //alert(trait_name)
          this.setState({
              isLoading: true,
              showTable: false,
              showLDPlot: false,
              snpResults: true,
              showLDTable: false,
              getLDData: false,
            })
          //console.log(this.state.trait_name);
          //var trait_url = process.env.REACT_APP_EXPRESS_URL + "/disease/" + term.replaceAll(' ', '%20');
          var trait_url = process.env.REACT_APP_EXPRESS_URL + "/gwas/" + term.replaceAll(' ', '%20');
          //console.log(trait_url);
          const data = await axios.get(trait_url);
           //console.log(data);
           if(!data.data.length) {
               this.setState({snpResults: false})
           }else {
                this.setState({
                    snps: data.data,
                    showTable: true,
                    snpResults: true,
                    isLoading: false
                })
                
           }
           
        } catch (e) {
            console.log(e)
        }
    };
    SNPDetail = (row, isSelect, rowIndex, e) => {
        //console.log(this.state.ldvariant);
        //console.log(this.state.cell);
        const id = row.RSID;
        var variantID = row.Variant;
        const variant_tmp = variantID.split(':');
        const chr = variant_tmp[0]
        const pos = variant_tmp[1]
        const allele = variant_tmp[2].split('/')
        const ref = allele[0]
        const alt = allele[1]
        variantID = chr + "_" + pos + "_" + ref + "_" + alt
        //console.log(variantID)
        const snpURL = process.env.REACT_APP_BASE_URL + '/snps/' + this.state.cell + '/' + variantID;
        window.open(snpURL, "_blank")
    }
    handleSearch = async() => {
        try{
            this.setState({isLoading: true})
            const res = await axios.get(process.env.REACT_APP_EXPRESS_URL + '/disease/')
            //console.log(res);
            //console.log(res.data)
            const searchResults = res.data.map((i) => ({
                label: i.Disease_trait,
            }));
            // res.data.map(a => hintArray.push(a.Disease_trait))
            // res.data.map(a => Disease_options.push(a.Disease_trait))
            // console.log(Disease_options)
            this.setState({options: searchResults})
            this.setState({isLoading: false})

        }catch (e) {
            console.log(e)
        }
    }
    handleChange = (event) => {
        this.setState({ trait_name : event.target.value });
    }
    handleIndexSNPSubmit = (event) => {
        //console.log(this.state.cell);
        //console.log(this.state.r_cutoff);
        //console.log(this.state.indexSNP);
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        this.setState({
            isLoadingLD: true,
            showIGV: false,
            showLDTable: false,
        })
        const res_generateTable = this.generateTableData(this.state.indexSNP);
        //console.log(res_generateTable);
        event.preventDefault();
    }
    handleSubmit = (event) => {
        //this.getSNPData();
        //alert('A name was submitted: ' + this.state.trait_name);
        //console.log(this.state.ldvariant);
        //console.log(this.state.cell);
        const snpURL = process.env.REACT_APP_BASE_URL + '/snps/' + this.state.cell + '/' + this.state.ldvariant;
        window.open(snpURL, "_blank")
        // if(this.state.cell === "hMSC"){
        //     const snpURL = process.env.REACT_APP_BASE_URL + '/snps/hMSC/' + this.state.ldvariant;
        //     window.open(snpURL, "_blank")
        // }else if(this.state.cell === "Osteoblast"){
        //     const snpURL = process.env.REACT_APP_BASE_URL + '/snps/h/' + this.state.ldvariant;
        // }
        //window.open(newPageUrl, "_blank")
        event.preventDefault();
    }
    handleChangeCell = (event) => {
        this.setState({ cell : event.target.value });
    }
    handleChangeCutoff = (event) => {
        this.setState({r_cutoff: event.target.value })
    }
    handleOnSearch = (string, results) => {
        console.log(string, results);
    };
    handleOnHover = (result) => {
        console.log(result);
    };
    handleOnSelect = (item) => {
        //console.log("handleOnSelect")
        //console.log(item.name);
        this.setState({ trait_name : item.name });
        this.getSNPData(item.name);
    };
    
    handleOnFocus = () => {
        console.log("Focused");
        //console.log("trait_name:")
        //console.log(this.state.trait_name)
        
    };

    hyperLink = (cell, row) => {
        return (
            <div><a href={"https://pubmed.ncbi.nlm.nih.gov/"+cell} target="_blank">{cell}</a></div>
        );
    }
    GCST_hyperlink = (cell, row) => {
        return (
            <div><a href={"https://www.ebi.ac.uk/gwas/studies/"+cell} target="_blank">{cell}</a></div>
        );
    }
    SNP_hyperlink = (cell, row) => {
        return (
            <div><a href={"https://www.ebi.ac.uk/gwas/variants/"+cell} target="_blank">{cell}</a></div>
        );
    }
    customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing { from } to { to } of { size } Results
      </span>
    );
  
    componentDidMount() {
        this.getTrait();
    }

    render() {
        // const apiBase = "https://portaldev.sph.umich.edu/api/v1/";
        // var data_sources = new LocusZoom.DataSources()
        // .add("assoc", ["AssociationLZ", {url: apiBase + "statistic/single/", params: { source: 45, id_field: "variant" }}])
        // .add("ld", ["LDServer", { url: "https://portaldev.sph.umich.edu/ld/", params: { source: '1000G', build: 'GRCh38', population: 'ALL' } }])
        // .add("gene", ["GeneLZ", { url: apiBase + "annotation/genes/", params: { build: 'GRCh38' } }])
        // .add("recomb", ["RecombLZ", { url: apiBase + "annotation/recomb/results/", params: { build: 'GRCh38' } }])
        // .add("constraint", ["GeneConstraintLZ", { url: "https://gnomad.broadinstitute.org/api/", params: { build: 'GRCh38' } }]);
        // var stateUrlMapping = {chr: "chrom", start: "start", end: "end"};
        // // Fetch initial position from the URL, or use some defaults
        // var initialState = LzDynamicUrls.paramsFromUrl(stateUrlMapping);
        // if (!Object.keys(initialState).length) {
        //     initialState = {chr: 10, start: 114550452, end: 115067678};
        // }

        // const layout = LocusZoom.Layouts.get("plot", "standard_association", {state: initialState});
        // window.plot = LocusZoom.populate("#lz-plot", data_sources, layout);
        return (
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">Disease</CardTitle>
                            </CardHeader>
                            <CardBody>
                            <ReactSearchAutocomplete
                                items={this.state.options}
                                maxResults={20}
                                onSearch={this.handleOnSearch}
                                onSelect={this.handleOnSelect}
                                onFocus={this.handleOnFocus}
                                onHover={this.handleOnHover}
                                //onClear
                                styling={{ 
                                    zIndex: 2,
                                    searchIconMargin: "10px 12px 0 11px",
                                    clearIconMargin: "10px 0 8px 0"
                                }} // To display it on top of the search box below
                                autoFocus
                            />
                                
                                
                            </CardBody>
                        </Card>
                    </Col>
                    { (this.state.showTable && this.state.snpResults && !this.state.isLoading)
                        ?    <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">{this.state.trait_name} relevant SNPs</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                    <div className="SNPTable">
                                        <BootstrapTable
                                            keyField="_id"
                                            data={this.state.snps}
                                            columns={this.columns}
                                            selectRow={this.selectIndexSNP }
                                            striped
                                            hover
                                            condensed
                                            pagination={paginationFactory(this.options)}
                                        />
                                        <Modal isOpen={this.state.modal} toggle={this.toggle}>
                                            <ModalHeader toggle={this.toggle}>Select the cell type</ModalHeader>
                                            <ModalBody>
                                                <Form onSubmit={this.handleIndexSNPSubmit}>
                                                    <FormGroup>
                                                        <Label for="SelectCellType">Select Cell-Type</Label>
                                                        <Input type="select" value={this.state.cell} placeholder="select cell-type" onChange={this.handleChangeCell}>
                                                            <option>hMSC</option>
                                                            <option>Osteoblast</option>
                                                            <option>Osteocyte</option>
                                                        </Input>
                                                        <Label for="SelectCellType">Select cutoff of r-square</Label>
                                                        <Input type="select" value={this.state.r_cutoff} placeholder="select cell-type" onChange={this.handleChangeCutoff}>
                                                            <option>0.9</option>
                                                            <option>0.8</option>
                                                            <option>0.7</option>
                                                            <option>0.6</option>
                                                            <option>0.5</option>
                                                            <option>0.4</option>
                                                            <option>0.3</option>
                                                            <option>0.2</option>
                                                            <option>0.1</option>
                                                        </Input>
                                                    </FormGroup>
                                                    <Button>View the LD SNPs of {this.state.rsid}</Button>
                                                </Form> 
                                            </ModalBody>
                                        </Modal>       
                                    </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        : (this.state.snpResults == false && !this.state.isLoading) ? 
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">Can't find any {this.state.trait_name} relevant SNPs</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Col>
                        : (this.state.isLoading) ? 
                            <Col md="12">
                                <Loader type="spin" />
                            </Col>
                        : null 
                    }
                    {/* { (this.state.showLDTable && this.state.showTable && this.state.snpResults && !this.state.isLoading)
                        ? <Col md="12">
                            <Card>
                            <CardHeader>
                                <CardTitle tag="h4">{this.state.rsid}'s regional plot</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div id="lz-plot" data-region={this.state.datarange}></div>
                                </CardBody>
                            </Card>
                            </Col>
                        :null
                    } */}
                    { (this.state.showLDTable && this.state.showTable && this.state.snpResults && !this.state.isLoadingLD && this.state.getLDData)
                        ?   <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">{this.state.rsid}'s LD Plot in {this.state.cell} (cutoff:{this.state.r_cutoff})</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div id="igv-div" style={igvStyle}></div>
                                    </CardBody>
                                </Card>
                            </Col>
                        : null
                    }
                    { (this.state.showLDTable && this.state.showTable && this.state.snpResults && !this.state.isLoadingLD && this.state.getLDData)
                        ?    <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">{this.state.rsid} LD SNPs</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                    <div className="SNPTable">
                                        <BootstrapTable
                                            keyField="_id"
                                            data={this.state.ldsnps}
                                            columns={this.LD_columns}
                                            selectRow={this.selectSNP}
                                            striped
                                            hover
                                            condensed
                                            pagination={paginationFactory(this.options)}
                                        />
                                        {/* <Modal isOpen={this.state.modal} toggle={this.toggle}>
                                            <ModalHeader toggle={this.toggle}>Select the cell type</ModalHeader>
                                            <ModalBody>
                                                <Form onSubmit={this.handleSubmit}>
                                                    <FormGroup>
                                                        <Label for="SelectCellType">Select Cell-Type</Label>
                                                        <Input type="select" value={this.state.cell} placeholder="select cell-type" onChange={this.handleChangeCell}>
                                                            <option>hMSC</option>
                                                            <option>Osteoblast</option>
                                                            <option>Osteocyte</option>
                                                        </Input>
                                                    </FormGroup>
                                                    <Button>View detail of {this.state.ldrsid}</Button>
                                                </Form> 
                                            </ModalBody>
                                        </Modal>      */}
                                    </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        : (this.state.showLDTable && this.state.showTable && this.state.snpResults && !this.state.isLoadingLD && !this.state.getLDData) ?
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">Can't find any {this.state.rsid} relevant LD SNPs</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Col>
                        : (this.state.isLoadingLD) ? 
                            <Col md="12">
                                <Loader type="spin" />
                            </Col>
                        :null
                    }
                </Row>
            </div>
        );
    }
}

export default DiseaseSearch;