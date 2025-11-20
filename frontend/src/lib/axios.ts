import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://solution-squad-backend-development.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
