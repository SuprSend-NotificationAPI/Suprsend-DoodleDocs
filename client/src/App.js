import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from './components/Navbar';
import DocState from './context/document/docstate'
import Docshome from './components/Docshome';
import suprsend from "@suprsend/web-sdk";
import "./index.css"
import Login from './components/login';
import Register from './components/Register';
import Preferences from './preferences';
import Alldocs from './components/Alldocs';
import DocOpen from './components/DocOpen';
import Alert from './components/Alert'
suprsend.init(process.env.REACT_APP_WKEY,process.env.REACT_APP_WSECRET);

export default function App() {
  const [alert,setAlert] = React.useState(null);
  const showAlert = (message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }


  return (
    <DocState>
      <Router>
       <Navbar showAlert = {showAlert} />
       <Alert alert={alert}/>
       <Routes>
       <Route exact path="/" element = {<Docshome showAlert={showAlert} />} />
       <Route exact path="/login" element = {<Login showAlert = {showAlert} />} />
       <Route exact path="/signup" element = {<Register showAlert = {showAlert}/>} />
       <Route exact path="/showalldocs" element = {<Alldocs/>} />
       <Route exact path="/userpreference" element = {<Preferences />} />
       <Route exact path="/opendoc/:id" element = {<DocOpen showAlert={showAlert} />} />
       </Routes>
      </Router>
    </DocState>
  )
}
