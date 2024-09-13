
import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Link to="/ticketstatus" className="sidebar-item">🎫<br/>Ticket Status</Link>
            <Link to="/scanner" className="sidebar-item">📷<br/>Scanner</Link>
        </aside>
    );
};

export default Sidebar;
