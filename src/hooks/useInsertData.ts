import type { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

const useInsertData = async <T>(
  url: string,
  params: T,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...config?.headers,
      },
    };

    const res = await baseUrl.post<T>(url, params, defaultConfig);
    return res.data;
  } catch (error) {
    console.error(`Error inserting data to ${url}:`, error);
    throw new Error("Failed to insert data");
  }
};


const useInsertData2 = async <TResponse, TParams>(
 url: string,
  params: TParams,
  config?: AxiosRequestConfig
): Promise<TResponse> => {
  try {
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...config?.headers,
      },
    };

    const res = await baseUrl.post<TResponse>(url, params, defaultConfig);
    return res.data;
  } catch (error) {
    console.error(`Error inserting data to ${url}:`, error);
    throw new Error("Failed to insert data");
  }
};



const useInsertDataWithImage = async <T>(
  url: string,
  formData: FormData,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const mergedConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
         ...config.headers,
      },
      ...config,
    };

    const response = await baseUrl.post<T>(url, formData, mergedConfig);
    return response.data;
  } catch (error) {
    console.error(`❌ Error inserting image data to ${url}:`, error);
    throw new Error("Failed to insert image data");
  }
};

 export { useInsertData, useInsertDataWithImage ,useInsertData2};
