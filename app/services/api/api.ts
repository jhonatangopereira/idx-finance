import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API,
});

export { api };