import React, { Fragment } from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
//import {Typeahead} from 'react-bootstrap-typeahead';
import { Hint } from 'react-autocomplete-hint';
import { AutoComplete } from "@react-md/autocomplete";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Loader } from '../../vibe/';



// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Input,
    Form,
  } from "reactstrap";

class DiseaseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trait_name: '',
            snps: [],
            hintData: [],
            showTable: false,
            snpResults: true,
            options: [],
            isLoading: false,
            selectDisease: [],
            caseSensitive: false,
            ignoreDiacritics: true
        };
        this.columns = [
            { dataField: "RSID", text: "SNP ID" },
            { dataField: "Risk_allele", text: "Risk allele" },
            { dataField: "Risk_allele_AF", text: "Risk allele AF" },
            { dataField: "Pubmed", text: "Pubmed", formatter: this.hyperLink },
            { dataField: "Reported_gene", text: "Reported gene" },
            { dataField: "P-value", text: "P-value", sort: true },
            { dataField: "STUDY_ACCESSION", text: "Study ID"},
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
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    getTrait = async () => {
        try{
            const res = await axios.get('http://localhost:5000/disease/')
            console.log(res.data);
            var hintArray = []
            res.data.map(a => hintArray.push(a.Disease_trait))
            console.log(hintArray)
            this.setState({hintData: hintArray})
            const searchResults = res.data.map((i,no) => ({
                id: no,
                name: i.Disease_trait,
            }));
            console.log(searchResults)
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
          this.setState({isLoading: true})
          //console.log(this.state.trait_name);
          //var trait_url = "http://localhost:5000/disease/" + this.state.trait_name.replaceAll(' ', '%20');
          var trait_url = "http://localhost:5000/disease/" + term.replaceAll(' ', '%20');
          console.log(trait_url);
          const data = await axios.get(
              trait_url
               //"http://localhost:5000/disease/Heel%20bone%20mineral%20density"
           );
           console.log(data);
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

    handleSearch = async() => {
        try{
            this.setState({isLoading: true})
            const res = await axios.get('http://localhost:5000/disease/')
            //console.log(res);
            console.log(res.data)
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

    handleSubmit = (event) => {
        this.getSNPData();
        //alert('A name was submitted: ' + this.state.trait_name);
        event.preventDefault();
    }
    handleOnSearch = (string, results) => {
        console.log(string, results);
    };
    
    handleOnSelect = (item) => {
        console.log("handleOnSelect")
        console.log(item.name);
        this.setState({ trait_name : item.name });
        this.getSNPData(item.name);
    };
    
    handleOnFocus = () => {
        console.log("Focused");
        console.log("trait_name:")
        console.log(this.state.trait_name)
        
    };

    hyperLink = (cell, row) => {
        return (
            <div><a href={"https://pubmed.ncbi.nlm.nih.gov/"+cell} target="_blank">{cell}</a></div>
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
        return (
            <div className="content">
                <Row>
                    {/* <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">Disease</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={this.handleSubmit}>
                                    <InputGroup className="no-border">
                                        <Hint options={this.state.hintData} allowTabFill>
                                            <input 
                                                type="text" 
                                                value={this.state.trait_name} 
                                                placeholder="Search disease trait..." 
                                                onChange={this.handleChange}
                                                
                                            />
                                        </Hint>
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText>
                                                <input type="submit" value="Search" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">Disease</CardTitle>
                            </CardHeader>
                            <CardBody>
                                
                                    <AutoComplete style={{ width: 1000}}
                                        id="simple-autocomplete-4"
                                        //label="Both Autocomplete"
                                        placeholder="Heel"
                                        data={this.state.hintData}
                                        autoComplete="both"
                                        highlight
                                    />
                                
                            </CardBody>
                        </Card>
                    </Col> */}
                    <Col md="12">
                        <Card>
                            <CardHeader>
                            <CardTitle tag="h4">Disease</CardTitle>
                            </CardHeader>
                            <CardBody>
                            <ReactSearchAutocomplete
                                items={this.state.options}
                                maxResults={15}
                                onSearch={this.handleOnSearch}
                                onSelect={this.handleOnSelect}
                                onFocus={this.handleOnFocus}
                                styling={{ zIndex: 2 }} // To display it on top of the search box below
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
                                            striped
                                            hover
                                            condensed
                                            pagination={paginationFactory(this.options)}
                                        />       
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
                </Row>
            </div>
        );
    }
}

export default DiseaseSearch;