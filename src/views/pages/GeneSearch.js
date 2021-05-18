import React from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import igv from 'igv';
import { Loader } from '../../vibe/';
import classnames from 'classnames';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

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
    TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";

var igvStyle = {
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: '8px',
    border: '1px solid lightgray'
  }

class GeneSearch extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
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
            gene: '',
            locus_range: '',
            locus_hic_url: '',
            locus_snp_url: '',
            atac_url: '',
            dnase_url: '',
            chromHMM_url: '',
            H3k27ac_url: '',
            H3k4me3_url: '',
            H3k4me1_url: '',
            H3k9ac_url: '',
            gencode_url: '',
            encode_ccre_url: '',
            hic: '',
            selectRowNo: null,
            showTable: false,
            snpResults: false,
            showIGV: false,
            isLoading: false,
            SNPColumns: [],
        };
        this.exonicColumns = []
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
        const { ExportCSVButton } = CSVExport;

        
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
        
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab,
          });
        }
    }

    componentDidMount() {
        //console.log("showIGV state" + this.state.showIGV)
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.showIGV && prevState.showIGV !== this.state.showIGV){
            //console.log('showIGV state has changed:' + this.state.showIGV);
            //console.log('range state has changed:' + this.state.locus_range)
            //console.log('prevState.locus_range:' + prevState.locus_range)
            
            var igvContainer = document.getElementById('igv-div');
            
            var igvOptions = {
                genome: 'hg38', 
                //locus: 'BRCA1'
                //locus: "chr8:118835887-119042590",
                locus: this.state.locus_range,
                thickness: 5,
                tracks: [
                    {
                        url: this.state.locus_hic_url,
                        type: "interaction",
                        format: "bedpe",
                        name: "Significant Hi-C",
                        //arcType: "proportional",
                        useScore: true,
                        arcType: "nested",
                        //color: "rgb(204,102,0)",
                        color: "blue",
                        //alpha: "0.05",
                        logScale: true,
                        showBlocks: true,
                        //max: 80,
                        visibilityWindow: 10000000,
                        height: 150
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
                        visibilityWindow: 10000000
                    },
                ]
            };
            
            return igv.createBrowser(igvContainer, igvOptions);

        }
    }
    generateIGVFile = async () => {
        try{
            var promoter_api_url;
            var columns_update;
            if (this.state.cell === "hMSC") {
                promoter_api_url = process.env.REACT_APP_EXPRESS_URL + "/promoterhMSC2gene/" + this.state.gene;
                columns_update = [
                    { dataField: "RSID", text: "rsID"},
                    { dataField: "ExonicFunc_Ensembl", text: "Function"},
                    { dataField: "AAChange_Ensembl", text: "AAChange"},
                    { dataField: "Promoter_like_region", text: "Promoter"},
                    { dataField: "chromHMM_E026_25", text: "ChromHMM"},
                    { dataField: "OpenChromatin_hMSC", text: "Open Chromatin"},
                    { dataField: "ATAC-MBPS_hMSC-Day1", text: "TF footprinting"},
                    { dataField: "SigHiC_hMSC", text: "Hi-C info"},
                ]
                this.setState({
                    exonicColumns: columns_update,
                    atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ATAC_seq-hMSC_pvalue.bigwig',
                    dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/DNase_seq_hMSC.bigWig',
                    chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/E026_25_imputed12marks_hg38lift_dense.bed',
                    H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF223NOV_hMSC_H3K27Ac_pvalue.bigWig',
                    H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF611FKW_hMSC_H3K4me3_pvalue.bigWig',
                    H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF648BRC_hMSC_H3K4me1_pvalue.bigWig',
                    H3k9ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/hMSC/ENCFF757SDY_hMSC_H3K9ac_pvalue.bigWig',
                })
            }else if(this.state.cell === "Osteoblast"){
                promoter_api_url = process.env.REACT_APP_EXPRESS_URL + "/promoterOB2gene/" + this.state.gene;
                columns_update = [
                    { dataField: "RSID", text: "rsID"},
                    { dataField: "ExonicFunc_Ensembl", text: "Function"},
                    { dataField: "AAChange_Ensembl", text: "AAChange"},
                    { dataField: "Promoter_like_region", text: "Promoter"},
                    { dataField: "chromHMM_E129_25", text: "ChromHMM"},
                    { dataField: "OpenChromatin_OB", text: "Open Chromatin"},
                    { dataField: "ATAC-MBPS_hMSC-Day15", text: "TF footprinting"},
                    { dataField: "SigHiC_OB13", text: "Hi-C info"},
                ]
                this.setState({
                    exonicColumns: columns_update,
                    atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ATAC_seq-osteoblast_pvalue.bigWig',
                    dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/DNase_seq_osteoblast.bigWig',
                    chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/E129_25_imputed12marks_hg38lift_dense.bed',
                    H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF048BRN_H3K27ac_OB_p-value.bigWig',
                    H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF327MED_ H3K4me3_OB_pvalue.bigWig',
                    H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF103BYE_H3K4me1_OB_pvalue.bigWig',
                })
            }else{
                promoter_api_url = process.env.REACT_APP_EXPRESS_URL + "/promoterOC2gene/" + this.state.gene;
                columns_update = [
                    { dataField: "RSID", text: "rsID"},
                    { dataField: "ExonicFunc_Ensembl", text: "Function"},
                    { dataField: "AAChange_Ensembl", text: "AAChange"},
                    { dataField: "Promoter_like_region", text: "Promoter"},
                    { dataField: "chromHMM_E129_25", text: "ChromHMM"},
                    { dataField: "OpenChromatin_OB", text: "Open Chromatin"},
                    { dataField: "ATAC-MBPS_hMSC-Day15", text: "TF footprinting"},
                    { dataField: "SigHiC_OC", text: "Hi-C info"},
                ]
                this.setState({
                    exonicColumns: columns_update,
                    atac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ATAC_seq-osteoblast_pvalue.bigWig',
                    dnase_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/DNase_seq_osteoblast.bigWig',
                    chromHMM_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/E129_25_imputed12marks_hg38lift_dense.bed',
                    H3k27ac_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF048BRN_H3K27ac_OB_p-value.bigWig',
                    H3k4me3_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF327MED_ H3K4me3_OB_pvalue.bigWig',
                    H3k4me1_url: process.env.REACT_APP_BASE_URL + '/igv/bigwig/osteoblast/ENCFF103BYE_H3K4me1_OB_pvalue.bigWig',
                })
            }
            //console.log(promoter_api_url)
            const res_promoter = await axios.get(promoter_api_url);
            var promoter_update = res_promoter.data
            var igv_bedpe_content;
            var start_min = 1000000000000000;
            var end_max = 0;
            for(var i=0;i<promoter_update.length;i++){
                var hicPromoterBin = promoter_update[i].HiC_Promoter_bin.split(':')
                var hicPromoterBinChr = hicPromoterBin[0];
                var hicPromoterBinStart = hicPromoterBin[1];
                var hicPromoterBinEnd = hicPromoterBin[2];
                var hicRegBin = promoter_update[i].HiC_Distal_bin.split(':')
                var hicRegBinChr = hicRegBin[0];
                var hicRegBinStart = hicRegBin[1];
                var hicRegBinEnd = hicRegBin[2];
                if(hicPromoterBinStart < start_min){
                    start_min = hicPromoterBinStart
                }
                if(hicRegBinStart < start_min){
                    start_min = hicRegBinStart
                }
                if(hicPromoterBinEnd > end_max){
                    end_max = hicPromoterBinEnd
                }
                if(hicRegBinEnd > end_max){
                    end_max = hicRegBinEnd
                }
                var each_interaction = "chr" + hicRegBinChr + "\t" + hicRegBinStart + "\t" + hicRegBinEnd + "\tchr" + hicPromoterBinChr + "\t" + hicPromoterBinStart + "\t" + hicPromoterBinEnd + "\t10\n";
                if(igv_bedpe_content == null){
                    igv_bedpe_content = each_interaction
                }else{
                    igv_bedpe_content += each_interaction
                }
                
                //console.log('each_interaction:' + each_interaction)
                promoter_update[i].Chr = promoter_update[i].Chr + ":" + promoter_update[i].Start + "-" + promoter_update[i].End
                //console.log('promoter:' + promoter_update[i].Chr)
            }
            const response = await fetch(process.env.REACT_APP_EXPRESS_URL + '/writeFile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "interactionByGene",
                    cell: this.state.cell,
                    gene: this.state.gene,
                    content: igv_bedpe_content,
                }),
            });
            const writeRes = await response.text();
            //console.log("write file:")
            //console.log(writeRes)
            var start_pos = parseInt(start_min) - 10000
            var end_pos = parseInt(end_max) + 10000
            if (start_pos < 0){
                start_pos = 0
            }
            //console.log("locus range:chr" + hicPromoterBinChr + ":" + start_pos + "-" + end_pos)
            this.setState({
                locus_range: "chr" + hicPromoterBinChr + ":" + start_pos + "-" + end_pos,
                locus_hic_url: process.env.REACT_APP_BASE_URL + "/igv/" + this.state.gene + "_" + this.state.cell + ".bedpe.txt",
                isLoading: false,
                showTable: true,
                snpResults: true,
                showIGV: true,
            })
            return "generate IGV data successfully";

        } catch (e) {
            console.log(e)
        }
    }
    getSNPData = async () => {
        try{
          //alert(trait_name)
          //console.log(this.state.trait_name);
          var snp_url = process.env.REACT_APP_EXPRESS_URL + "/snp2gene/" + this.state.gene;
          //console.log(snp_url);
          const res = await axios.get(snp_url);
          //console.log(res.data);
          //console.log("type of data:" + typeof res.data)
          if(!res.data.length) {
            this.setState({
                snpResults: false,
                showTable: true,
            })
            
          }else { 
            this.setState({
                snps: res.data,
            })
            const res_generateIGV = await this.generateIGVFile();
            //console.log("res_generateIGV:")
            //console.log(res_generateIGV);
            
          }
          
           
        } catch (e) {
            console.log(e)
        }
    };
    handleChangeGene = (event) => {
        this.setState({ gene : event.target.value });
    }
    handleChangeCell = (event) => {
        this.setState({ cell : event.target.value });
    }
    
    handleSubmit = (event) => {
        //console.log(this.state.gene);
        //console.log(this.state.cell);
        this.setState({
            showTable: false,
            snpResults: false,
            showIGV: false,
            isLoading: true,
        })
        igv.removeAllBrowsers()
        this.getSNPData();
        //alert('A name was submitted: ' + this.state.rsid);
        
        event.preventDefault();
    }
    
    render() {
        //const igv_ele = this.getIGV();
        const ExportCSV = (props) => {
            const handleClick = () => {
                props.onExport();
            };
            return (
                <div>
                    {/* <Button color="secondary"><i className="fa fa-cloud-download" onClick={ handleClick }></i>&nbsp;&nbsp;Export CSV</Button> */}
                    {/* <button className="btn btn-success" onClick={ handleClick }>Export to CSV</button> */}
                    <Button className="fa fa-cloud-download" onClick={ handleClick }>Export to CSV</Button>
                </div>
            );
        };
        return (
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">Gene</CardTitle>
                            </CardHeader>
                            
                            <CardBody>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup className="no-border"> 
                                        <Input 
                                            type="text" 
                                            value={this.state.gene} 
                                            placeholder="Search Gene..." 
                                            onChange={this.handleChangeGene}
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
                    {(this.state.snpResults && this.state.showIGV)
                        ? <Col md="12">
                            <Card>
                                <CardHeader>
                                <CardTitle tag="h4">{this.state.gene}'s IGV in {this.state.cell} cell-type</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div id="igv-div" style={igvStyle}></div>
                                </CardBody>
                            </Card>
                        </Col>
                        : null
                    }
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                            href="#"
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => {
                                this.toggle('1');
                            }}
                            >
                            Coding Region
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            href="#"
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => {
                                this.toggle('2');
                            }}
                            >
                            Proximal regulatory region
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            href="#"
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => {
                                this.toggle('3');
                            }}
                            >
                            Distal regulatory region
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                        { (this.state.snpResults && !this.state.isLoading)
                        ? 
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">Coding Region of {this.state.gene} in {this.state.cell} cell-type</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                    <div className="SNPTable">
                                        <ToolkitProvider
                                            keyField="_id"
                                            //data={this.state.snps}
                                            data={this.state.snps}
                                            columns={this.state.exonicColumns}
                                            
                                            exportCSV={{
                                                fileName: 'coding_variants.csv',
                                                //separator: '\t',
                                            }}
                                            >
                                            {
                                                props => (
                                                <div>
                                                    {/* <CSVExport.ExportCSVButton { ...props.csvProps }>Export CSV</CSVExport.ExportCSVButton> */}
                                                    <ExportCSV { ...props.csvProps } />
                                                    <hr />
                                                    <BootstrapTable
                                                        pagination={paginationFactory(this.options)}
                                                        striped
                                                        hover
                                                        condensed
                                                        { ...props.baseProps }
                                                    />
                                                </div>
                                                )
                                            }
                                        </ToolkitProvider>
                                        {/* <BootstrapTable
                                        
                                            keyField="_id"
                                            //data={this.state.snps}
                                            data={this.state.snps}
                                            columns={this.state.exonicColumns}
                                            striped
                                            hover
                                            condensed
                                            pagination={paginationFactory(this.options)}
                                        /> */}
                                    </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        : (this.state.snpResults === false && this.state.showTable === true) ? 
                            <Col md="12">
                                <Card>
                                    <CardHeader>
                                    <CardTitle tag="h4">Can't find any {this.state.gene} relevant SNPs</CardTitle>
                                    </CardHeader>
                                </Card>
                            </Col>
                        : (this.state.isLoading) ? 
                            <Col md="12">
                                <Loader type="spin" />
                            </Col>
                        : null 
                        }
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                        
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                        
                        </Row>
                    </TabPane>
                    </TabContent>
                       
                </Row>
            </div>
        );
    }
}

export default GeneSearch;