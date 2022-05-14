import axios from 'axios';

function request(obj = {}) {
    return axios(obj)
}

export default request;