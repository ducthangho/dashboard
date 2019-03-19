import React, {Component} from 'react';
//import logo from './logo.svg';
//import './App.css';
//import { createResource } from 'simple-cache-provider';
//import { withCache } from './components/withCache'; 
//import Report from 'powerbi-report-component';
import $ from 'jquery';
import jsonp from 'jsonp';
import pbi, { models } from 'powerbi-client';
import PropTypes from 'prop-types';
//import frameguard from 'frameguard';
import { observer } from "mobx-react";
import { action,observable, runInAction } from "mobx";
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import root from 'window-or-global'

const PAGEVIEW = 'fitToWidth';
const DEBUG = true;
const W="100%"
// const H = "100%";

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
      if (DEBUG) console.log('LOADED!!!!');
      return (<div ref={ref} {...props}/>);  
    } else {
      if (DEBUG) console.log('NOT LOADED yet');
      return (<h1 ref={ref} {...props}> LOADING .... </h1>);
    }
  });

EmbedDiv.displayName = 'Powerbi Embed';

// const reportURL="https://app.powerbi.com/reportEmbed?reportId=5b65576a-3027-4c09-9270-2992c709b379&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b&rs:embed=true";
// const reportID="f79fd2d4-0c67-4bcc-b1ec-5982a00cd77f";
const reportURL = "https://app.powerbi.com/reportEmbed?reportId=037d51e1-7d74-48ac-b066-389ddb9796b1&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
const reportID = "5b65576a-3027-4c09-9270-2992c709b379";
const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";

const getEmbedToken = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID="+reportID+"&groupId="+groupID;


const validateConfig = (config) => {
  switch (config.type) {
    case 'report':
      return models.validateReportLoad(config);
    case 'dashboard':
      return models.validateDashboardLoad(config);
    default:
      return 'Unknown config type';
  }
};


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
    this.updateToken = this.updateToken.bind(this);
    this.setTokenExpirationListener = this.setTokenExpirationListener.bind(this);      

  }

  createConfig(config){
    // Define default visual layout: visible in 400x300.
    // let defaultLayout = {
    //   width: 400,
    //   height: 250,
    //   displayState: {
    //     mode: models.VisualContainerDisplayMode.Hidden
    //   }
    // };
     
    // // Define page size as custom size: 1000x580.
    // let pageSize = {
    //     type: models.PageSizeType.Custom,
    //     width: 1000,
    //     height: 580
    // };
     
    // // Page layout: two visible visuals in fixed position.
    // let pageLayout = {
    //   defaultLayout: defaultLayout,
    //   visualsLayout: {
    //     "VisualContainer1": {
    //       x: 70,
    //       y: 100,
    //       displayState: {
    //         mode: models.VisualContainerDisplayMode.Visible
    //       }
    //     },
    //     "VisualContainer3": {
    //       x: 540,
    //       y: 100,
    //       displayState: {
    //         mode: models.VisualContainerDisplayMode.Visible
    //       }
    //     }
    //   }
    // };
         
    var rect = this.rootElement.current.getBoundingClientRect();
    console.log('rect = ',JSON.stringify(rect));
     
    var obj = {
        isLoaded: true,
        pageName: (config && config.pageName) ? config.pageName : undefined,
        width: W,
        height: $(window).height()-rect.top,  
        type: 'report',
        id: (config.id) ? (config.id) : reportID,
        embedUrl: (config.embedUrl) ? config.embedUrl : reportURL,
        tokenType: 1, //EMBED = 1, AAD = 0
        accessToken: config.accessToken,
        pageView: PAGEVIEW,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
          // layoutType: models.LayoutType.Custom,
          // customLayout: {
          //   pageSize: pageSize,
          //   displayOption: models.DisplayOption.FitToPage,
          //   pagesLayout: {
          //     "ReportSection684ed53eb1dda0130d8d": pageLayout
          //   }
          // }
        }
    };              

    return obj;
  }

  updateToken(reportId, groupId) {
    // Generate new EmbedToken
    const url = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID="+reportId+"&groupId="+groupId;
    jsonp(url,{ name: 'callback'}, (error,json) =>
            {              
              if (error){
                if (DEBUG) console.log('Error '+error);
                runInAction(  () => {
                  this.status = JSON.stringify({
                    isLoaded: true,
                    error: error
                  });
                });
              } else {
                //if (DEBUG) console.log('Here ---- '+json);
                //var models = window['powerbi-client'].models;                
                //this.updateState(this.props);
                // const obj = (this.status===null || this.status.length===0) ? null : JSON.parse(this.status);                
                //console.log('JSON = ',json);                

                var config = this.createConfig({
                  isLoaded: true,
                  // width: W,
                  // height: $(window).height()-rect.top-5,
                  type: 'report',
                  id: json.ReportId,
                  embedUrl: json.EmbedUrl,
                  tokenType: models.TokenType.Embed, //EMBED = 1, AAD = 0
                  accessToken: json.EmbedToken,
                  permissions: models.Permissions.All,
                  expiration: json.Expiry,     
                  ellapse: json.Ellapse,
                  pageView : PAGEVIEW
                });
                    
                this.updateState(config);
                const errors = validateConfig(config);
                if (!errors) {
                    if (!this.component) this.component = powerbi.embed(this.rootElement.current, config);
                    this.component.setAccessToken(json.EmbedToken)
                      .then(() => {
                      // Set token expiration listener
                      // result.expiration is in ISO format
                        this.setTokenExpirationListener(json.Ellapse,2 /*minutes before expiration*/);
                      });
                } else if (this.component !== null) {
                  this.reset();
                } else console.log(errors);

                
                            
                //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
                //this.status = obj;
              }
            }
        ).bind(this);  
  }

  setTokenExpirationListener(ellapse, 
      minutesToRefresh = 2, 
      reportId, 
      groupId){
      // get current time
      
      var safetyInterval = minutesToRefresh;

      // time until token refresh in milliseconds
      var timeout = (ellapse - safetyInterval) * 60 * 1000;      
      // if token already expired, generate new token and set the access token
      if (timeout<=0)
      {
          console.log("Updating Report Embed Token");
          this.updateToken(reportId, groupId);
      }
      // set timeout so minutesToRefresh minutes before token expires, token will be updated
      else 
      {
          console.log("Report Embed Token will be updated in " + timeout + " milliseconds.");
          // setTimeout(() => {
          //   this.updateToken(reportId, groupId);
          // }, timeout);
      }
  }


   performOnEmbed(report, dimensions) {
    
    const {
      embedType,
      onLoad,
      onSelectData,
      onPageChange,
      onTileClicked,
    } = this.props;
    //if (DEBUG) console.log('performOnEmbed ',embedType,report,onLoad,onSelectData,onPageChange,onTileClicked);
    if(embedType === 'report') {
      //if (DEBUG) console.log("Registering event handlers...");

      report.off("rendered");
      report.on('rendered', () => {
        //window.alert("rendered EVENT");
        console.log('rendered');
                
          if (onLoad) onLoad(report, dimensions);
        });


      // Report.off removes a given event handler if it exists.
      report.off("loaded");
      var me = this;
      report.on('loaded', () => {
          report.getPages()
          .then(function (pages) {
            var log = "Report pages:";
            pages.forEach(function(page) {
              log += "\n" + page.name + " - " + page.displayName;
            });
            console.log(log);
          })
          .catch(function (error) {
              console.log(error);
          });          

          console.log(report);

          var expiration = report.config.expiration;
          console.log(expiration+"   ;   "+report.config.id+"    ;   "+report.config.groupId);
          var ellapse = report.config.ellapse;
          me.setTokenExpirationListener(ellapse,
            2 /*minutes before expiration*/, 
            report.config.id, 
            report.config.groupId);          

          if (onLoad) onLoad(report, dimensions);


          });

      report.on("error", function(event) {
          // Log.log(event.detail);
          console.log(event.detail);
          alert(event.detail.detailedMessage);
          report.off("error");
      });

      report.off('dataSelected');
      report.on('dataSelected', (event) => {
        if (onSelectData) { onSelectData(event.detail); }
      });

      report.off('pageChanged');
      report.on('pageChanged', (event) => {
        if (onPageChange) { onPageChange(event.detail); }
      });


      //if (DEBUG) console.log("Registering event handlers finished ...",rp);
    } else if(embedType === 'dashboard'){
      report.off('tileClicked');
      report.on('tileClicked', (event) => {
        if (onTileClicked) { onTileClicked(report, event.detail); }
      });
    }
  }


  // static getDerivedStateFromProps(props, state) {
  //   return({...props.config})
  // }

  embed(config) {    
    this.component = powerbi.embed(this.rootElement.current, config);
    const height = this.rootElement.current.clientHeight;
    const width = this.rootElement.current.clientWidth;   
    this.performOnEmbed(this.component, { height, width });
    if (this.props.onEmbedded) {
      this.props.onEmbedded(this.component, { height, width });
    }
    return this.component;
  }

  reset() {
    // var rootObj = (this.rootElement && this.rootElement.current) ? this.rootElement.current : document.getElementById("root");
    //if (DEBUG) console.log('Root element = '+JSON.stringify(config));
    // if (this.rootElement===null || this.rootElement.current===null) this.rootElement = rootObj;
    //if (DEBUG) console.log('Reseting container ');
    powerbi.reset(this.rootElement.current);
    this.component = null;
  }

  
  @action
  componentDidMount() {        
    this.subscription = source.pipe(debounceTime(1500)).subscribe( this.updateWindowDimensions);
      

    if (DEBUG) console.log('componentDidMount');
    jsonp(getEmbedToken,{ name: 'callback'}, (error,json) =>
            {              
              if (error){
                if (DEBUG) console.log('Error '+error);
                runInAction(  () => {
                  this.status = JSON.stringify({
                    isLoaded: true,
                    error: error
                  });
                });
              } else {
                //if (DEBUG) console.log('Here ---- '+json);
                //var models = window['powerbi-client'].models;                
                //this.updateState(this.props);
                // const obj = (this.status===null || this.status.length===0) ? null : JSON.parse(this.status);      
                // var rect = this.rootElement.current.getBoundingClientRect();
                // console.log('rect = ',JSON.stringify(rect));
                const config = this.createConfig({
                    isLoaded: true,
                    // width: W,
                    // height: $(window).height()-rect.top,
                    type: 'report',
                    id: json.ReportId,
                    embedUrl: json.EmbedUrl,
                    tokenType: models.TokenType.Embed, //EMBED = 1, AAD = 0
                    accessToken: json.EmbedToken,
                    permissions: models.Permissions.All,
                    expiration: json.Expiry,                    
                    ellapse: json.Ellapse,
                    pageView : PAGEVIEW,
                    //settings: { filterPaneEnabled: false, navContentPaneEnabled: false }                                      
                  });
                console.log('Initial config = ',config)  ;
                this.updateState(config);                                      
                
                //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
                //this.status = obj;
              }
            }
        ).bind(this);

  }

  componentDidUpdate() {
    if (DEBUG) console.log('componentDidUpdate');
    let config = JSON.parse( this.status);    
    const errors = validateConfig(config);
    if (!errors) {
      console.log('No error');
      return this.embed(config);
    } else if (this.component !== null) {      
      this.reset();
    } else console.log(errors, config);
    return null;
  }


  @action
  updateState (props) {
    if (DEBUG) console.log('updateState');
     
    const nextState = Object.assign({}, (!this.status || this.status.length===0) ? {} : JSON.parse(this.status), props, {
      isLoaded: true,
      pageName: this.props.pageName,
      // settings: {
      //   filterPaneEnabled: this.props.filterPaneEnabled,
      //   navContentPaneEnabled: this.props.navContentPaneEnabled,
      //   layoutType: this.props.mobile ? pbi.models.LayoutType.MobilePortrait : undefined
      // },
      // settings: settings,
      type: this.props.embedType ? this.props.embedType : 'report'
    })
    const config = this.createConfig(nextState);
    runInAction( () => {      
      this.status = JSON.stringify(config);
    })
    
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this.updateWindowDimensions);
    this.subscription.unsubscribe();
    if (DEBUG) console.log('componentWillUnmount');
  }

  getStyles(props) {
    const styles = {}
    var obj = (!this.status || this.status.length===0) ? { width: $(window).width(),  height: $(window).height()} : JSON.parse(this.status);
    if (props.vertical) {
      styles.height = `${obj.height}px`
    }
    if (props.horizontal) {
      styles.width = `${obj.width}px`
    }
    return styles
  }

  @action
  updateWindowDimensions(evt) {    
    if (DEBUG) console.log('updateWindowDimensions');
    //this.status.width = $(window).width();
    //this.status.height = $(window).height();
    var config = (!this.status || this.status.length===0) ? null : JSON.parse(this.status);
    if (config && config.isLoaded){    
      
      var obj = this.createConfig({
        isLoaded: true,
        // width: W,
        // height: $(window).height()-rect.top,  
        type: 'report',
        id: (config.id) ? (config.id) : reportID,
        embedUrl: (config.embedUrl) ? config.embedUrl : reportURL,
        tokenType: 1, //EMBED = 1, AAD = 0
        accessToken: config.accessToken,
        pageView: PAGEVIEW,        
        //settings: { filterPaneEnabled: false, navContentPaneEnabled: false }                  
      });
      
      this.reset();
      //if (DEBUG) console.log('New Config = '+JSON.stringify(obj));
      this.updateState(obj);
      this.embed(obj);            
    }

  }
  
  // static defaultProps = {
  //   horizontal: true,
  //   vertical: true,
  // }

  // static propTypes = {
  //   horizontal: PropTypes.bool,
  //   vertical: PropTypes.bool,
  // }
  

  render() {
      let isLoaded = (!this.status || this.status.length===0) ? false : JSON.parse(this.status).isLoaded;

      if (DEBUG) console.log('Now render');
      return (                  
          <EmbedDiv className="report" style={this.getStyles(this.props)} isloaded={isLoaded.toString()} ref={this.rootElement} />
        
      );

      //<div className="powerbi-frame"  ref={this.rootElement} style={this.getStyles(vertical, horizontal)} >                     
      // </div>                                      
    // }
  }
}

App.propTypes = {  
  onEmbedded: PropTypes.func,
  onLoad:  PropTypes.func,
  onSelectData:  PropTypes.func,
  onPageChange:  PropTypes.func,
  onTileClicked:  PropTypes.func,
  pageName: PropTypes.string,
  mobile: PropTypes.object,
  embedType: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  filterPaneEnabled: PropTypes.bool,
  navContentPaneEnabled: PropTypes.bool,
  horizontal: PropTypes.bool,
  vertical: PropTypes.bool,
  pageView : PropTypes.string,  
};

App.defaultProps = {  
  horizontal: true,
  vertical: true
}

EmbedDiv.propTypes = {
  isloaded: PropTypes.string
}

export default App;
