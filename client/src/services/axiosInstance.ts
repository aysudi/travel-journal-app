import axios from "axios";
import { API_BASE_URL } from "./api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

export default instance;
