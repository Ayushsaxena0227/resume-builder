import axios from "axios";

const API = "http://localhost:5000/api/user";

export const getPersonalInfo = async (userId) => {
  const res = await axios.get(`${API}/${userId}/personal`);
  return res.data;
};

export const updatePersonalInfo = async (userId, data) => {
  const res = await axios.post(`${API}/${userId}/personal`, data);
  return res.data;
};
