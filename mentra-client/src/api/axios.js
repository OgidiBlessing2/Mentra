import axios from "axios";


// TODO - create the base url endpoint to the dotenv file before shipping to stardance

const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;