import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
//import { createResource } from 'simple-cache-provider';
//import { withCache } from './components/withCache'; 
//import Report from 'powerbi-report-component';
import $ from 'jquery';
import jsonp from 'jsonp';
import * as pbi from 'powerbi-client';
import PropTypes from 'prop-types';
//import frameguard from 'frameguard';
import { observer } from "mobx-react";
import { action,observable, runInAction } from "mobx";
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import root from 'window-or-global'


// const getSize = () => {
//   const {
//     clientHeight: height = 0,
//     clientWidth: width = 0,
//   } = root.document.body || {}

//   return { height, width }
// }

const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory)


const EmbedDiv = React.forwardRef((props, ref) => {  
    if (props.isloaded=="true"){  
      console.log('LOADED!!!!');
      return (<div ref={ref} {...props}/>);  
    } else {
      console.log('NOT LOADED yet');
      return (<h1 ref={ref} {...props}> LOADING .... </h1>);
    }
  });

EmbedDiv.displayName = 'Powerbi Embed';


const getEmbedToken = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==";
const reportURL="https://app.powerbi.com/reportEmbed?reportId=f79fd2d4-0c67-4bcc-b1ec-5982a00cd77f&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b&rs:embed=true";
const reportID="f79fd2d4-0c67-4bcc-b1ec-5982a00cd77f";

const validateConfig = (config) => {
  switch (config.type) {
    case 'report':
      return pbi.models.validateReportLoad(config);
    case 'dashboard':
      return pbi.models.validateDashboardLoad(config);
    default:
      return 'Unknown config type';
  }
};


// const readToken = createResource(async function fetchNews() {  
  // const res = await $.ajax({
  //           url: getEmbedToken,
  //           jsonpCallback: 'callback',
  //           contentType: 'application/javascript',
  //           dataType: "jsonp",
  //           success: function (json) {

  //               var models = window['powerbi-client'].models;

  //               var embedConfiguration = {
  //                   type: 'report',
  //                   id: json.ReportId,
  //                   embedUrl: json.EmbedUrl,
  //                   tokenType: models.TokenType.Embed,
  //                   accessToken: json.EmbedToken,
  //                   settings: { filterPaneEnabled: false, navContentPaneEnabled: false }
  //               };

  //               var $reportContainer = $('#reportContainer');
  //               var report = powerbi.embed($reportContainer.get(0), embedConfiguration);


  //           },
  //           error: function () {
  //               alert("Error");
  //           }
  //       });
  //return await res.json();
// });

const source = fromEvent(root,'resize');

@observer
class App extends Component {

  @observable status = "";


  constructor(props) {
    super(props);
    this.report = null; // to store the loaded report's object to perform operations like print, fullscreen etc..
    this.component = null;
    this.rootElement = React.createRef();  
    this.reportStyle = {            
      border: '0',      
      padding: '20px',
      background: '#eee',
      height : 600,
      width : 800
    };

    this.extraSettings = {
              filterPaneEnabled: false, //true
              navContentPaneEnabled: false, //true
              // ... more custom settings
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getStyles = this.getStyles.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.updateState = this.updateState.bind(this);
    

  }

  


  // static getDerivedStateFromProps(props, state) {
  //   return({...props.config})
  // }

  embed(config) {
    // var rootObj = (this.rootElement.current) ? this.rootElement.current : document.getElementById("root");
    //console.log('Root element = '+JSON.stringify(config));
    // if (this.rootElement===null || this.rootElement.current===null) this.rootElement = rootObj;
    this.component = powerbi.embed(this.rootElement.current, config);
    const height = this.rootElement.current.clientHeight;
    const width = this.rootElement.current.clientWidth;
    if (this.props.onEmbedded) {
      this.props.onEmbedded(this.component, { height, width });
    }
    return this.component;
  }

  reset() {
    // var rootObj = (this.rootElement && this.rootElement.current) ? this.rootElement.current : document.getElementById("root");
    //console.log('Root element = '+JSON.stringify(config));
    // if (this.rootElement===null || this.rootElement.current===null) this.rootElement = rootObj;
    console.log('Reseting container ');
    powerbi.reset(this.rootElement.current);
    this.component = null;
  }

  // onResize = (dimensions) => {
  //   const { onResize } = this.props
  //   onResize && onResize(dimensions)
  // }

  @action
  componentDidMount() {    
    //this.updateWindowDimensions();
    //window.addEventListener('resize', this.updateWindowDimensions);

    this.subscription = source.pipe(debounceTime(1500)).subscribe( this.updateWindowDimensions);
      

    console.log('componentDidMount');
    jsonp(getEmbedToken,{ name: 'callback'}, (error,json) =>
            {              
              if (error){
                console.log('Error '+error);
                runInAction(  () => {
                  this.status = JSON.stringify({
                    isLoaded: true,
                    error: error
                  });
                });
              } else {
                //console.log('Here ---- '+json);
                //var models = window['powerbi-client'].models;                
                //this.updateState(this.props);
                const obj = (this.status===null || this.status.length===0) ? null : JSON.parse(this.status);

                const config = {
                    isLoaded: true,
                    width: $(window).width(),
                    height: $(window).height(),                  
                    type: 'report',
                    id: (obj && obj.id) ? (obj.id) : reportID,
                    embedUrl: (obj && obj.embedUrl) ? obj.embedUrl : reportURL,
                    tokenType: 1, //EMBED = 1, AAD = 0
                    accessToken: json.EmbedToken
                    //settings: { filterPaneEnabled: false, navContentPaneEnabled: false }                  
                  };
                this.updateState(config);                                      
                
                //console.log('Result = '+ JSON.stringify(obj));
                //this.status = obj;
              }
            }
        ).bind(this);

  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    let config = JSON.parse( this.status);    
    const errors = validateConfig(config);
    if (!errors) {
      return this.embed(config);
    } else if (this.component !== null) {
      this.reset();
    }
    return null;
  }


  @action
  updateState (props) {
    console.log('updateState');
    const nextState = Object.assign({}, (!this.status || this.status.length===0) ? {} : JSON.parse(this.status), props, {
      isLoaded: true,
      pageName: this.props.pageName,
      settings: {
        filterPaneEnabled: this.props.filterPaneEnabled,
        navContentPaneEnabled: this.props.navContentPaneEnabled,
        layoutType: this.props.mobile ? pbi.models.LayoutType.MobilePortrait : undefined
      },
      type: this.props.embedType ? this.props.embedType : 'report'
    })
    runInAction( () => {
      this.status = JSON.stringify(nextState);  
    })
    
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this.updateWindowDimensions);
    this.subscription.unsubscribe();
    console.log('componentWillUnmount');
  }

  getStyles(vertical, horizontal) {
    const styles = {}
    var obj = (!this.status || this.status.length===0) ? { width: $(window).width(),  height: $(window).height()} : JSON.parse(this.status);
    if (vertical) {
      styles.height = `${obj.height}px`
    }
    if (horizontal) {
      styles.width = `${obj.width}px`
    }
    return styles
  }

  @action
  updateWindowDimensions(evt) {    
    console.log('updateWindowDimensions');
    //this.status.width = $(window).width();
    //this.status.height = $(window).height();
    var config = (!this.status || this.status.length===0) ? null : JSON.parse(this.status);
    if (config && config.isLoaded){      
      var obj = {
        isLoaded: true,
        width:  $(window).width(),
        height: $(window).height(),
        type: 'report',
        id: (config.id) ? (config.id) : reportID,
        embedUrl: (config.embedUrl) ? config.embedUrl : reportURL,
        tokenType: 1, //EMBED = 1, AAD = 0
        accessToken: config.accessToken
        //settings: { filterPaneEnabled: false, navContentPaneEnabled: false }                  
      };
      
      this.reset();
      console.log('New Config = '+JSON.stringify(obj));
      this.updateState(obj);
      this.embed(obj);            
    }

  }

  handleDataSelected = (data) => {
    // will be called when some chart or data element in your report clicked
    window.alert('Data selected ');
  }

  handleReportLoad = (report) => {
    // will be called when report loads   
    this.report = report; // get the object from callback and store it.(optional)
    window.alert('Report Loaded');
  }

  handlePageChange = (data) => {
    // will be called when pages in your report changes
    console.log('Page changed');
  }

  handleTileClicked = (dashboard, data) => { // only used when embedType is "dashboard"
    // will be called when report loads

    this.report = dashboard; // get the object from callback and store it.(optional)
    console.log('Data from tile', data);
  }

  static defaultProps = {
    horizontal: true,
    vertical: true,
  }

  static propTypes = {
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
  }
  

  render() {    
    

    // var me = this;
    // $.ajax({
    //         url: getEmbedToken,
    //         jsonpCallback: 'callback',
    //         contentType: 'application/javascript',
    //         dataType: "jsonp",
    //         success: function (json) {

    //             var models = window['powerbi-client'].models;

    //             var embedConfiguration = {
    //                 type: 'report',
    //                 id: json.ReportId,
    //                 embedUrl: json.EmbedUrl,
    //                 tokenType: models.TokenType.Embed,
    //                 accessToken: json.EmbedToken,
    //                 settings: { filterPaneEnabled: false, navContentPaneEnabled: false }
    //             };

    //             var $reportContainer = $('#reportContainer');
    //             var report = powerbi.embed($reportContainer.get(0), embedConfiguration);


    //         },
    //         error: function () {
    //             alert("Error");
    //         }
    //     });

    //console.log('Redering ...'+JSON.stringify(this.status));    
    const { vertical, horizontal } = this.props


    // if (this.status.error) {
    //   return <div>Error: {error.message}</div>;
    // } else if (!this.status.isLoaded) {
    //   console.log('LOADING....');
    //   return <div>Loading...</div>;
    // } else {      
      // this.reportStyle = {            
      //   border: '0',      
      //   padding: '20px',
      //   background: '#eee',
      //   height : this.status.height,
      //   width : this.status.width
      // };
      //var models = pbi.models;

      //var embedConfiguration = Object.assign({},this.status);

      //console.log('Config is '+this.status);

      //this.embed(embedConfiguration);

      var isLoaded = (!this.status || this.status.length===0) ? false : JSON.parse(this.status).isLoaded;

      console.log('Now render');
      return (                  
          <EmbedDiv className="report" style={this.getStyles(vertical, horizontal)} isloaded={isLoaded.toString()} ref={this.rootElement} />
        
      );

      //<div className="powerbi-frame"  ref={this.rootElement} style={this.getStyles(vertical, horizontal)} >                     
      // </div>                                      
    // }
  }
}

App.propTypes = {  
  onEmbedded: PropTypes.func,
  pageName: PropTypes.string,
  mobile: PropTypes.object,
  embedType: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  filterPaneEnabled: PropTypes.bool,
  navContentPaneEnabled: PropTypes.bool  
};

EmbedDiv.propTypes = {
  isloaded: PropTypes.string
}

export default App;
