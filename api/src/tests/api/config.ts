import { AxiosRequestConfig } from 'axios';

const { DEV } = import.meta.env;

// Use local IP address instead of localhost to fix Axios error 'ECONNREFUSED'.
const SERVER_HOSTNAME = DEV
  ? `http://${process.env.LOCALHOST_IP_ADDRESS ?? 'localhost'}`
  : process.env.SERVER_HOSTNAME ?? 'localhost';

const SERVER_PORT = process.env.SERVER_API_PORT ?? '8000';

export const API_BASE_URL = `${SERVER_HOSTNAME}:${SERVER_PORT}`;

export const TIMEOUT = 30000; // 30 sec

// Prevent axios from throwing an error if HTTP code is not within the 200 range.
export const OPTIONS: AxiosRequestConfig = {
  validateStatus: (status) => status < 500,
};
