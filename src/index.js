import React, {Component} from 'react'
import ReactDOM from 'react-dom'
//import Message from './js/Message'

import Header from './js/Header';
import Sidebar from './js/Sidebar';
import Content from './js/Content';
// import Footer from './js/Footer';
import SidebarCtrl from './js/SidebarCtrl';


//import jQuert from 'jquery';
import 'bootstrap';
import 'jquery-slimscroll';
import 'admin-lte';

 //import '../dist/styles.css'
import './css/bootstrap.min.css'
import './css/AdminLTE.css'
import './css/skins/_all-skins.css'
import './css/ionicons.min.css'
import './css/font-awesome.min.css'
import './css/style.css'

class MyComponent extends Component {  
  render() {    
    return (            
      <div>
        <Header />
        <Sidebar />
        <Content />        
        <SidebarCtrl />        
      </div>   
    );
  }
}


ReactDOM.render(
  <MyComponent />,
  document.getElementById('root') // eslint-disable-line no-undef
)

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  

