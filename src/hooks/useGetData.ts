import { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

// Use AxiosRequestConfig to define params or other config settings
const useGetData = async <T,>(
  url: string,
  params?: AxiosRequestConfig<any>
): Promise<T> => {
  try {
    const res = await baseUrl.get<T>(url, params);
    return res.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error("Failed to fetch data");
  }
};

const useGetDataToken = async <T,>(url: string): Promise<T> => {
  const token = localStorage.getItem("token");
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await baseUrl.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error(`Error fetching data with token from ${url}:`, error);
    throw new Error("Failed to fetch data with token");
  }
};

export { useGetData, useGetDataToken };
