import React/*, { useState }*/ from "react";
import Sidebar from './layout/Sidebar';
//import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
//import type { MenuProps } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link,
} from "react-router-dom";

//import { Breadcrumb, Layout, Menu, theme } from "antd";
import Verifier from "./pages/Verifier";/**/
import Scanner from './scanner/Scanner';
import Header from "./layout/Header";

const App: React.FC = () => {
  return (
    <Router>
    <div className="app">
    <Sidebar /> 
        <Routes>
                <Route path="/scanner" element={<Scanner />} />
            </Routes> 
            <Routes>
                <Route path="/ticketstatus" element={<Verifier />} />
            </Routes> 
        <Header />
        
    </div>
    </Router>
  )
};

export default App;
