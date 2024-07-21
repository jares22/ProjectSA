// src/components/SeatMap.tsx
import React, { useState, useEffect } from 'react';
import './SeatMap.css';

interface Seat {
    id: number;
    seatNumber: string;
    status: string;
}

const SeatMap: React.FC = () => {
    const [seats, setSeats] = useState<Seat[]>([]);

    useEffect(() => {
        // ฟังก์ชันดึงข้อมูลที่นั่งจาก API
        const fetchSeats = async () => {
            try {
                const response = await fetch('/api/seats'); // ปรับ endpoint ตามที่ Backend กำหนด
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Seat[] = await response.json();
                setSeats(data);
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };

        fetchSeats();
    }, []);

    return (
        <div className="seat-map">
            {seats.map((seat) => (
                <div
                    key={seat.id}
                    className={`seat ${seat.status}`}
                    title={`Seat ${seat.seatNumber}`}
                >
                    {seat.seatNumber}
                </div>
            ))}
        </div>
    );
};

export default SeatMap;
