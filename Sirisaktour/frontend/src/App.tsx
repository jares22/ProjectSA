import React/*, { useState }*/ from "react";
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

const App: React.FC = () => {
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Verifier />} />
  </Routes>
  </Router>
  );
};

export default App;
