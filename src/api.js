import axios from 'axios';

const API_URL = 'https://pipepoly-inventory-backend.onrender.com/items';

export const getAllItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getItemByQRCode = async (qr_code) => {
  const response = await axios.get(`${API_URL}/${qr_code}`);
  return response.data;
};

export const addItem = async (item) => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const updateItemQuantity = async (qr_code, data) => {
  const response = await axios.put(`${API_URL}/${qr_code}`, data);
  return response.data;
};

export const deleteItem = async (qr_code) => {
  const response = await axios.delete(`${API_URL}/${qr_code}`);
  return response.data;
};
