import axios from "axios";

const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

export const getPersonalInfo = async (userId, token) => {
  const res = await axios.get(`${baseURL}/api/user/personal`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updatePersonalInfo = async (userId, data, token) => {
  const res = await axios.post(`${baseURL}/api/user/personal`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
