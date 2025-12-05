import axios from "axios";

const url = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: "https://solution-squad-backend-development.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
