import axios from "axios";

const API = "http://localhost:5000/api/user";

export const getPersonalInfo = async (userId, token) => {
  const res = await axios.get(`${API}/personal`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updatePersonalInfo = async (userId, data, token) => {
  const res = await axios.post(`${API}/personal`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
