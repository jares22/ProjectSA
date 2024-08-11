import React, { useState, useEffect } from 'react';
import { Row, Col, Modal } from 'antd';
import Seat from './Seat';
import { Seat as SeatType } from '../types/types';
import { getSeatDetails } from '../services/https'; // นำเข้าฟังก์ชัน API
import './BusLayout.css'; // นำเข้าฟิล CSS

interface BusLayoutProps {
  seats: SeatType[];
}

const BusLayout: React.FC<BusLayoutProps> = ({ seats }) => {
  const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
  const [ownerDetails, setOwnerDetails] = useState<string>('');
  const [seatDetails, setSeatDetails] = useState<Map<number, { isOccupied: boolean; owner: string }>>(new Map());

  useEffect(() => {
    const fetchSeatDetails = async () => {
      for (const seat of seats) {
        try {
          const details = await getSeatDetails(seat.number);
          setSeatDetails(prev => new Map(prev).set(seat.number, details));
        } catch (error) {
          console.error('Error fetching seat details:', error);
        }
      }
    };

    fetchSeatDetails();
  }, [seats]);

  const handleSeatClick = (seatNumber: number) => {
    const seat = seatDetails.get(seatNumber);
    if (seat) {
      setSelectedSeat({ number: seatNumber, isOccupied: seat.isOccupied, isVerified: false }); // ต้องการปรับให้ตรงกับข้อมูลจริง
      setOwnerDetails(seat.owner || 'รายละเอียดเจ้าของไม่พร้อมใช้งาน');
    }
  };

  const handleClose = () => {
    setSelectedSeat(null);
    setOwnerDetails('');
  };

  return (
    <div className="bus-layout-container">
      <div className="bus-layout-content">
        <h2>Bus Layout</h2>
        {Array.from({ length: Math.ceil(seats.length / 10) }).map((_, rowIndex) => (
          <Row key={rowIndex} justify="center" gutter={[16, 16]}>
            {seats.slice(rowIndex * 10, rowIndex * 10 + 10).map((seat) => (
              <Col key={seat.number} span={2}>
                <Seat
                  seat={{ ...seat, isOccupied: seatDetails.get(seat.number)?.isOccupied || false }}
                  onClick={() => handleSeatClick(seat.number)}
                />
              </Col>
            ))}
          </Row>
        ))}
      </div>
      {selectedSeat && (
        <Modal
          title={`รายละเอียดสำหรับที่นั่ง ${selectedSeat.number}`}
          visible={!!selectedSeat}
          onOk={handleClose}
          onCancel={handleClose}
        >
          <p>หมายเลขที่นั่ง: {selectedSeat.number}</p>
          <p>สถานะ: {selectedSeat.isOccupied ? 'มีผู้ใช้งาน' : 'ไม่มีผู้ใช้งาน'}</p>
          <p>เจ้าของ: {ownerDetails || 'ไม่มีเจ้าของ'}</p>
        </Modal>
      )}
    </div>
  );
};

export default BusLayout;
