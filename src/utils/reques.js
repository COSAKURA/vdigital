import Axios from 'axios';

const request = Axios.create({
    baseURL: 'http://172.46.225.96:8888', // 后端服务器地址
    timeout: 50000,
    withCredentials: true, // 确保发送凭证（如 Cookies）
    headers: {
        'Content-Type': 'application/json'
    }
});

export default request;