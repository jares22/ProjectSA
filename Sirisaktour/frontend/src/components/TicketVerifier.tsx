// import React, { useState } from 'react';
// import { Ticket } from '../types/types';
// import { Input, Button, Typography, notification } from 'antd';

// const { Title } = Typography;

// interface TicketVerifierProps {
//   tickets: Ticket[];
//   onVerify: (ticketId: string) => void;
//   onRevert: (ticketId: string) => void; // Add onRevert prop
// }

// const TicketVerifier: React.FC<TicketVerifierProps> = ({ tickets, onVerify, onRevert }) => {
//   const [ticketId, setTicketId] = useState('');
//   const [revertTicketId, setRevertTicketId] = useState(''); // State for reversion

//   const handleVerify = () => {
//     const ticket = tickets.find((t) => t.id === ticketId);
//     if (ticket) {
//       if (ticket.isVerified) {
//         notification.warning({
//           message: 'Verification Warning',
//           description: 'This ticket has already been verified.',
//         });
//       } else {
//         onVerify(ticketId);
//         notification.success({
//           message: 'Verification Success',
//           description: 'Ticket verified successfully!',
//         });
//       }
//       setTicketId('');
//     } else {
//       notification.error({
//         message: 'Verification Error',
//         description: 'Invalid ticket ID',
//       });
//     }
//   };

//   const handleRevert = () => {
//     const ticket = tickets.find((t) => t.id === revertTicketId);
//     if (ticket) {
//       if (!ticket.isVerified) {
//         notification.warning({
//           message: 'Reversion Warning',
//           description: 'This ticket has not been verified.',
//         });
//       } else {
//         onRevert(revertTicketId);
//         notification.success({
//           message: 'Reversion Success',
//           description: 'Ticket verification reverted successfully!',
//         });
//       }
//       setRevertTicketId('');
//     } else {
//       notification.error({
//         message: 'Reversion Error',
//         description: 'Invalid ticket ID',
//       });
//     }
//   };

//   return (
//     <div className="ticket-verifier-container" style={{ padding: '20px', background: '#f0f2f5', borderRadius: '8px' }}>
//       <Title level={3}>Ticket Verifier</Title>
//       <Input
//         value={ticketId}
//         onChange={(e) => setTicketId(e.target.value)}
//         placeholder="Enter ticket ID to verify"
//         style={{ marginBottom: '10px' }}
//       />
//       <Button type="primary" onClick={handleVerify} style={{ marginRight: '10px' }}>
//         Verify Ticket
//       </Button>
//       <Input
//         value={revertTicketId}
//         onChange={(e) => setRevertTicketId(e.target.value)}
//         placeholder="Enter ticket ID to revert"
//         style={{ marginBottom: '10px' }}
//       />
//       <Button type="default" onClick={handleRevert}>
//         Revert Verification
//       </Button>
//     </div>
//   );
// };

// export default TicketVerifier;
