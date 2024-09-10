// import React, { useState, useEffect } from 'react';
// import { Button, Select, Modal } from 'antd';
// import Seat from './Seat'; // Assuming this component handles individual seat rendering and selection logic
// import { GetVerifiers, getSeatDetails } from '../services/https/index'; // Assuming GetVerifiers fetches the verifiers data

// const { Option } = Select;

// // Static seat layout, adjust if needed
// const seatsLeft = [
//   ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
//   ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
// ];

// const seatsRight = [
//   ['A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20'],
//   ['B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20'],
// ];

// const initialSelectedSeats = ['A8', 'C9', 'C10'];

// const SeatMap: React.FC = () => {
//   const [selectedSeats, setSelectedSeats] = useState<string[]>(initialSelectedSeats);
//   const [bookedSeats, setBookedSeats] = useState<string[]>([]);
//   const [seatDetails, setSeatDetails] = useState<Map<string, { isOccupied: boolean; isVerified: boolean; owner: string }>>(new Map());
//   const [selectedSeatDetails, setSelectedSeatDetails] = useState<{ isOccupied: boolean; isVerified: boolean; owner: string } | null>(null);

//   // Fetch verifiers and update booked seats
//   const getVerifiers = async () => {
//     try {
//       const res = await GetVerifiers();
//       if (res) {
//         const fetchedBookedSeats = res.map((verifier: { seat: string }) => verifier.seat);
//         setBookedSeats(fetchedBookedSeats);
//       }
//     } catch (error) {
//       console.error('Error fetching verifiers:', error);
//     }
//   };

//   useEffect(() => {
//     getVerifiers();
//   }, []);

//   // Fetch seat details
//   useEffect(() => {
//     const fetchSeatDetails = async () => {
//       const fetchedSeatDetails: Map<string, { isOccupied: boolean; isVerified: boolean; owner: string }> = new Map();
//       for (const row of [...seatsLeft, ...seatsRight]) {
//         for (const seat of row) {
//           try {
//             const details = await getSeatDetails(seat);
//             fetchedSeatDetails.set(seat, details);
//           } catch (error) {
//             console.error('Error fetching seat details:', error);
//           }
//         }
//       }
//       setSeatDetails(fetchedSeatDetails);
//     };

//     fetchSeatDetails();
//   }, []);

//   // Handle seat selection
//   const onSelectSeat = (seatNumber: string) => {
//     setSelectedSeats((prev) =>
//       prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
//     );
//   };

//   // Handle seat click to show details
//   const handleSeatClick = (seatNumber: string) => {
//     setSelectedSeatDetails(seatDetails.get(seatNumber) || null);
//   };

//   const totalPrice = selectedSeats.length * 100;

//   return (
//     <div className="container">
//       <div
//         style={{
//           textAlign: 'left',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '20px',
//           marginLeft: 220,
//         }}
//       >
//         <div>
//           <h2 style={{ margin: 0 }}>เลือกรอบรถ</h2>
//           <p style={{ margin: '5px 0' }}>*this is for the emp</p>
//           <Select defaultValue="14:40" style={{ width: 120 }}>
//             <Option value="14:40">14:40</Option>
//             <Option value="16:00">16:00</Option>
//             <Option value="18:20">18:20</Option>
//             <Option value="20:40">20:40</Option>
//           </Select>
//         </div>
//         <div style={{ textAlign: 'left' }}>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//             <div
//               style={{
//                 width: '15px',
//                 height: '15px',
//                 backgroundColor: '#1A2C50',
//                 marginRight: '5px',
//                 borderRadius: '3px',
//               }}
//             ></div>
//             <p style={{ margin: 0, marginRight: '10px' }}>Booked</p>
//             <div
//               style={{
//                 width: '15px',
//                 height: '15px',
//                 backgroundColor: 'white',
//                 marginRight: '5px',
//                 borderRadius: '3px',
//                 border: '1px solid black',
//               }}
//             ></div>
//             <p style={{ margin: 0, marginRight: '10px' }}>Available</p>
//             <div
//               style={{
//                 width: '15px',
//                 height: '15px',
//                 backgroundColor: '#007bff',
//                 marginRight: '5px',
//                 borderRadius: '3px',
//               }}
//             ></div>
//             <p style={{ margin: 0 }}>Selected</p>
//           </div>
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <div>
//           {seatsLeft.map((row, rowIndex) => (
//             <div key={rowIndex} className={`seat-row ${rowIndex >= 6 ? 'yellow-border' : ''}`}>
//               {row.map((seat) => (
//                 <Seat
//                   key={seat}
//                   number={seat}
//                   isOccupied={bookedSeats.includes(seat)}
//                   isVerified={seatDetails.get(seat)?.isVerified || false}
//                   onSelect={onSelectSeat}
//                   onClick={() => handleSeatClick(seat)}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//         <div style={{ width: '50px' }}></div> {/* Center gap */}
//         <div>
//           {seatsRight.map((row, rowIndex) => (
//             <div key={rowIndex} className={`seat-row ${rowIndex >= 6 ? 'yellow-border' : ''}`}>
//               {row.map((seat) => (
//                 <Seat
//                   key={seat}
//                   number={seat}
//                   isOccupied={bookedSeats.includes(seat)}
//                   isVerified={seatDetails.get(seat)?.isVerified || false}
//                   onSelect={onSelectSeat}
//                   onClick={() => handleSeatClick(seat)}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="beforesummary">
//         <h2 style={{ color: 'black' }}>MERJE CINIPLEX</h2>
//       </div>
//       <div className="summary">
//         <Button type="default" style={{ marginRight: '10px' }}>
//           BACK TO
//         </Button>
//         <Button type="primary">CONFIRM</Button>
//       </div>

//       {/* Seat Details Modal */}
//       <Modal
//         title="Seat Details"
//         visible={!!selectedSeatDetails}
//         onCancel={() => setSelectedSeatDetails(null)}
//         footer={[
//           <Button key="ok" type="primary" onClick={() => setSelectedSeatDetails(null)}>
//             OK
//           </Button>,
//         ]}
//       >
//         {selectedSeatDetails ? (
//           <div>
//             <p>Owner: {selectedSeatDetails.owner}</p>
//             <p>Status: {selectedSeatDetails.isOccupied ? 'Occupied' : 'Available'}</p>
//             <p>Verified: {selectedSeatDetails.isVerified ? 'Yes' : 'No'}</p>
//           </div>
//         ) : (
//           <p>No details available.</p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default SeatMap;
