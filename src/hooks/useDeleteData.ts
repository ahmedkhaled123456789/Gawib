import baseUrl from "../Api/baseURL";
import { AxiosRequestConfig } from "axios";

 const useDeleteData = async <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params,
  };

  const res = await baseUrl.delete<T>(url, config);
  return res.data;
};

export default useDeleteData;
