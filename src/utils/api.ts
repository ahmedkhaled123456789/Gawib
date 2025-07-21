import type { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

// Generic function to GET data without token
export const useGetData = async <T>(
  url: string,
  params?: AxiosRequestConfig<unknown>
): Promise<T> => {
  try {
    const res = await baseUrl.get<T>(url, params);
    return res.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error("Failed to fetch data");
  }
};

// Generic function to GET data with token
export const useGetDataToken = async <T>(url: string): Promise<T> => {
  const token = localStorage.getItem("token");

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await baseUrl.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error(`Error fetching data with token from ${url}:`, error);
    throw new Error("Failed to fetch data with token");
  }
};

// Generic function to POST data with optional token and custom config
export const insertData = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> => {
  try {
    const token = localStorage.getItem("token");

    const mergedConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...config?.headers,
      },
    };

    const response = await baseUrl.post<TResponse>(url, data, mergedConfig);
    return response.data;
  } catch (error) {
    console.error(`POST ${url} failed:`, error);
    throw error; // Let the caller handle the error
  }
};
