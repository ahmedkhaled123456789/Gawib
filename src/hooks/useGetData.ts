import type { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

// Use AxiosRequestConfig to define params or other config settings
const useGetData = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  const config: AxiosRequestConfig = {
    ...options,
    withCredentials: true,
    headers: {
      ...(options?.headers || {}),
      //   'User-Agent': 'Dart/3.2 (dart:io)',
      // 'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip',
      // 'Connection': 'keep-alive'
    },
  };

  try {
    const res = await baseUrl.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching data from ${url}:`, error);
    throw new Error("Failed to fetch data");
  }
};

const getDataToken = async <T>(url: string): Promise<T> => {
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

// ================== get data by id ==================
const getDataById = async <T>(url: string, id: string | number): Promise<T> => {
  const token = localStorage.getItem("token");
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const res = await baseUrl.get<T>(`${url}/${id}`, config);
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching data from ${url}/${id}:`, error);
    throw new Error("Failed to fetch data by id");
  }
};

export { useGetData, getDataToken, getDataById };
