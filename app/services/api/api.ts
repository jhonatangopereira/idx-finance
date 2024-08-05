import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const api = axios.create({
    baseURL: "https://idxfinance.com.br",
});

export { api };