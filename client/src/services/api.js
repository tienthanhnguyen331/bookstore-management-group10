import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5051/api", // Use localhost for local development
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
