import axios from "axios";

const api = axios.create({
    baseURL: "http://172.20.10.2:5051/api", // Use IP address instead of localhost
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
