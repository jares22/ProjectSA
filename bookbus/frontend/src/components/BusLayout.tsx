// src/components/BusLayout.tsx

import React from 'react';
import { Row, Col } from 'antd';
import Seat from './Seat';
import { Seat as SeatType } from '../types/types';
import './BusLayout.css'; // Import the CSS file

interface BusLayoutProps {
  seats: SeatType[];
}

const BusLayout: React.FC<BusLayoutProps> = ({ seats }) => {
  const rows = Math.ceil(seats.length / 10);

  return (
    <div className="bus-layout-container">
      <div className="bus-layout-content">
        <h2>Bus Layout</h2>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Row key={rowIndex} justify="center" gutter={[16, 16]}>
            {seats.slice(rowIndex * 10, rowIndex * 10 + 10).map((seat) => (
              <Col key={seat.number} span={2}>
                <Seat seat={seat} />
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
};

export default BusLayout;
