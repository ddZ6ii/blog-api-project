import { AxiosRequestConfig } from 'axios';

// Use local IP address instead of localhost to fix Axios error 'ECONNREFUSED'.
const LOCALHOST = process.env.LOCALHOST_IP_ADDRESS ?? 'localhost';

const API_PORT = process.env.API_PORT ?? '3000';
const API_BASE_URL = `http://${process.env.API_PRIVATE_DOMAIN ?? LOCALHOST}`;
export const API_URL = `${API_BASE_URL}:${API_PORT}`;

export const TIMEOUT = 30000; // 30 sec

// Prevent axios from throwing an error if HTTP code is not within the 200 range.
export const OPTIONS: AxiosRequestConfig = {
  validateStatus: (status) => status < 500,
};
