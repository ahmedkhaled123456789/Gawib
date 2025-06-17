import axios from "axios";

export const baseURL = "https://vhost.ynafs.com:8443";
const axiosRequest = axios.create({ baseURL });

export default axiosRequest;
