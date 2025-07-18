import axios from 'axios';

export const loginClub = async (formData) =>
  axios.post('http://localhost:3000/api/clubs/login', formData);

export const registerClub = async (data) =>
  axios.post('http://localhost:3000/api/clubs/newclub', data);
