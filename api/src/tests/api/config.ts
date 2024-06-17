import { AxiosRequestConfig } from 'axios';

const { DEV } = import.meta.env;

// Use local IP address instead of localhost to fix Axios error 'ECONNREFUSED'.
const SERVER_URL = DEV
  ? `http://${process.env.LOCALHOST_IP_ADDRESS ?? 'localhost'}`
  : process.env.SERVER_URL ?? 'localhost';

const API_PORT = process.env.API_PORT ?? '3000';

export const API_BASE_URL = `${SERVER_URL}:${API_PORT}`;

export const TIMEOUT = 30000; // 30 sec

// Prevent axios from throwing an error if HTTP code is not within the 200 range.
export const OPTIONS: AxiosRequestConfig = {
  validateStatus: (status) => status < 500,
};
