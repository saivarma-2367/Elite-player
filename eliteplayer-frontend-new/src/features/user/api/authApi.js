import axios from 'axios';

export const loginUser = async (formData) =>
  axios.post('http://localhost:3000/api/users/login', formData);

export const registerUser = async (data) =>
  axios.post('http://localhost:3000/api/users/register', data);

export const fetchSlots = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/slots');
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

export const bookSlot = async ({ courtId, slotTime, playerId, sport }) => {
  return axios.post('http://localhost:3000/api/slots/book', {
    courtId,
    slotTime,
    playerId,
    sport
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
