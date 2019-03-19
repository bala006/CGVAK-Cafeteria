import axios from 'axios';

export default axios.create({
  baseURL: 'http://172.16.23.18:8001/'
});
