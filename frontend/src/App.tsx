// src/App.tsx
import React from 'react';
import SeatMap from './components/SeatMap';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <h1>Bus Ticket Booking System</h1>
            <SeatMap />
        </div>
    );
};

export default App;
