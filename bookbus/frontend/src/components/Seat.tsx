// src/components/Seat.tsx

import React from 'react';
import { Seat as SeatType } from '../types/types';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

interface SeatProps {
  seat: SeatType;
}

const Seat: React.FC<SeatProps> = ({ seat }) => {
  const backgroundColor = seat.isVerified
    ? 'green'
    : seat.isOccupied
    ? 'red'
    : 'gray';

  return (
    <Tooltip title={`Seat ${seat.number}`} placement="top">
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor,
          margin: '5px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        }}
      >
        <UserOutlined style={{ color: 'white', fontSize: '24px' }} />
      </div>
    </Tooltip>
  );
};

export default Seat;
