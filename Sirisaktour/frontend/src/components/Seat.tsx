// import React from 'react';
// import { UserOutlined } from '@ant-design/icons';
// import { Tooltip } from 'antd';
// import './Seat.css'; // Import CSS file

// export interface SeatProps {
//   number: string;
//   isOccupied: boolean;
//   isVerified: boolean;
//   onSelect: (seatNumber: string) => void;
//   onClick: () => void; // Added onClick handler
// }

// const Seat: React.FC<SeatProps> = ({ number, isOccupied, isVerified, onSelect, onClick }) => {
//   const backgroundColor = isVerified
//     ? 'green'
//     : isOccupied
//     ? 'red'
//     : 'gray';

//   return (
//     <Tooltip title={`Seat ${number}`} placement="top">
//       <div
//         className="seat"
//         style={{ backgroundColor }}
//         onClick={onClick} // Use onClick prop
//       >
//         <UserOutlined style={{ color: 'white', fontSize: '24px' }} />
//       </div>
//     </Tooltip>
//   );
// };

// export default Seat;
