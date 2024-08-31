import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Typography } from 'antd';
import Seat from './Seat';
import { Seat as SeatType } from '../types/types';
import { getSeatDetails } from '../services/https'; // API function to fetch seat details

const { Title, Paragraph } = Typography;

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
          setSeatDetails((prev) => new Map(prev).set(seat.number, details));
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
      setSelectedSeat({ number: seatNumber, isOccupied: seat.isOccupied, isVerified: false });
      setOwnerDetails(seat.owner || 'รายละเอียดเจ้าของไม่พร้อมใช้งาน');
    }
  };

  const handleClose = () => {
    setSelectedSeat(null);
    setOwnerDetails('');
  };

  return (
    <div className="bus-layout-container" style={{ padding: '20px', background: '#f0f2f5', borderRadius: '8px' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Bus Layout
      </Title>
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
      {selectedSeat && (
        <Modal
          title={`รายละเอียดสำหรับที่นั่ง ${selectedSeat.number}`}
          open={!!selectedSeat}
          onOk={handleClose}
          onCancel={handleClose}
          centered
        >
          <Paragraph>
            <strong>หมายเลขที่นั่ง:</strong> {selectedSeat.number}
          </Paragraph>
          <Paragraph>
            <strong>สถานะ:</strong> {selectedSeat.isOccupied ? 'มีผู้ใช้งาน' : 'ไม่มีผู้ใช้งาน'}
          </Paragraph>
          <Paragraph>
            <strong>เจ้าของ:</strong> {ownerDetails || 'ไม่มีเจ้าของ'}
          </Paragraph>
        </Modal>
      )}
    </div>
  );
};

export default BusLayout;
