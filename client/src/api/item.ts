import axios from "axios";

const API_URL = "http://localhost:3000";

export const getItems = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};