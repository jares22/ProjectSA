import React from 'react';
import { Seat as SeatType } from '../types/types';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip, Badge } from 'antd';

interface SeatProps {
  seat: SeatType;
  onClick: (seatNumber: number) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, onClick }) => {
  const getStatusColor = () => {
    if (seat.isVerified) return 'green';
    if (seat.isOccupied) return 'red';
    return 'gray';
  };

  return (
    <Tooltip title={`Seat ${seat.number}`} placement="top">
      <div
        onClick={() => onClick(seat.number)} // Click handler applied to the outer div
        className="seat"
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: '8px',
          backgroundColor: getStatusColor(),
        }}
      >
        <Badge
          count={<UserOutlined style={{ color: 'white', fontSize: '18px' }} />}
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    </Tooltip>
  );
};

export default Seat;
