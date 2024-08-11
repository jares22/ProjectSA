import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getSeatDetails = async (seatNumber: number) => {
  try {
    const response = await axios.get(`${API_URL}/seats/${seatNumber}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching seat details');
  }
};
