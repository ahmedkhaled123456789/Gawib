import axios from "axios";

export const baseURL = "https://test.jawib.net/api/";
const axiosRequest = axios.create({ baseURL });

export default axiosRequest;
