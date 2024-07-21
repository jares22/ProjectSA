import React, { useState } from 'react';

interface VerifyTicketRequest {
    ticketID: number;
    employeeID: number;
}

interface VerifyTicketResponse {
    message: string;
}

const TicketVerificationForm: React.FC = () => {
    const [ticketID, setTicketID] = useState<number>(0);
    const [employeeID, setEmployeeID] = useState<number>(0);
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const requestBody: VerifyTicketRequest = { ticketID, employeeID };

        try {
            const response = await fetch('http://localhost:8080/verify_ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data: VerifyTicketResponse = await response.json();
            setResponse(data.message);
        } catch (error) {
            setResponse('Error verifying ticket.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Ticket ID:</label>
                <input type="number" value={ticketID} onChange={(e) => setTicketID(parseInt(e.target.value))} required />
            </div>
            <div>
                <label>Employee ID:</label>
                <input type="number" value={employeeID} onChange={(e) => setEmployeeID(parseInt(e.target.value))} required />
            </div>
            <button type="submit">Verify Ticket</button>
            {response && <p>{response}</p>}
        </form>
    );
};

export default TicketVerificationForm;
