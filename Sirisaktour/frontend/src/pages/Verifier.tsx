import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ScheduleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import BusLayout from '../components/BusLayout';
import TicketVerifier from '../components/TicketVerifier';
import { Ticket, Seat } from '../types/types';
//import './App.css'; // Add any necessary styles for minor customizations

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const initialTickets: Ticket[] = Array.from({ length: 50 }, (_, i) => ({
  id: `T${String(i + 1).padStart(3, '0')}`,
  seatNumber: i + 1,
  isVerified: false,
}));

const initialSeats: Seat[] = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  isOccupied: initialTickets.some((t) => t.seatNumber === i + 1),
  isVerified: false,
}));

const Verifire: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [navOpen, setNavOpen] = useState(true);
  const navigate = useNavigate();

  const handleVerify = (ticketId: string) => {
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex].isVerified = true;
      setTickets(updatedTickets);

      const seatNumber = updatedTickets[ticketIndex].seatNumber;
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.number === seatNumber ? { ...seat, isVerified: true } : seat
        )
      );
    }
  };

  const handleRevert = (ticketId: string) => {
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex].isVerified = false;
      setTickets(updatedTickets);

      const seatNumber = updatedTickets[ticketIndex].seatNumber;
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.number === seatNumber ? { ...seat, isVerified: false } : seat
        )
      );
    }
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={!navOpen}>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/app')}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<ScheduleOutlined />} onClick={() => navigate('/schedule')}>
            Schedule
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
            Log Out
          </Menu.Item>
        </Menu>
        <Button
          type="primary"
          onClick={toggleNav}
          style={{
            width: '100%',
            borderRadius: 0,
            position: 'absolute',
            bottom: 0,
          }}
        >
          {navOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </Button>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: '#001529' }}>
          <Title level={2} style={{ color: '#fff', margin: '0 16px' }}>
            Bus Ticket Verification System
          </Title>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <div className="bus-layout-container" style={{ marginBottom: '20px' }}>
            <BusLayout seats={seats} />
          </div>
          <div className="ticket-verifier-container">
            <TicketVerifier tickets={tickets} onVerify={handleVerify} onRevert={handleRevert} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Verifire;
