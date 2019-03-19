import React, {Component} from 'react';
//import user2 from '../img/user2-160x160.jpg';
import App from './App';

const DEBUG = true;

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.report = null; // to store the loaded report's object to perform operations like print, fullscreen etc..
  }

  performOnEmbed(report, dimensions) {
    if (DEBUG) if (DEBUG) console.log('performOnEmbed called '+JSON.stringify(dimensions));    
  }
  
  handleDataSelected = (data) => {
    // will be called when some chart or data element in your report clicked
    if (DEBUG) console.log('handleDataSelected called '+JSON.stringify(data));
  }

  handleReportLoad = (report) => {
    // will be called when report loads

    this.report = report; // get the object from callback and store it.(optional)
    if (DEBUG) console.log('handleReportLoad called');
  }

  handlePageChange = (data) => {
    // will be called when pages in your report changes
    if (DEBUG) console.log('handlePageChange called ');
  }

  handleTileClicked = (dashboard, data) => { // only used when embedType is "dashboard"
    // will be called when report loads

    this.report = dashboard; // get the object from callback and store it.(optional)
    if (DEBUG) console.log('Data from tile', data);
  }


  render(){
    const extraSettings = {
        filterPaneEnabled: false, //true
        navContentPaneEnabled: false, //true        
        // ... more custom settings
    }
        // <section className="content-header">
          //   <h1>
          //     Page Header
          //     <small>Optional description</small>
          //   </h1>
          //   <ol className="breadcrumb">
          //     <li><a href="#"><i className="fa fa-dashboard"></i> Level</a></li>
          //     <li className="active">Here</li>
          //   </ol>
          // </section>

    return (            
        <div className="content-wrapper">                        
          <section className="content container-fluid">
            <div>
             <App 
                  embedType="report" // "dashboard"
                  tokenType="Embed" // "Aad"            
                  extraSettings={extraSettings}
                  permissions="All" // View            
                  onLoad={this.handleReportLoad}
                  onSelectData={this.handleDataSelected}
                  onPageChange={this.handlePageChange}
                  onTileClicked={this.handleTileClicked}
                  onEmbedded={this.performOnEmbed}
              /> 
            </div>
          </section>
          
        </div>

      )
  }
}