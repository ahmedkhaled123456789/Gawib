import { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

const useInsertData = async <T>(
  url: string,
  params: T,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    // Add Authorization token to the config headers
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...config?.headers, // Merge any additional headers from the config
      },
    };

    // Make the POST request with the given url, params, and config
    const res = await baseUrl.post<T>(url, params, defaultConfig);
    return res.data;
  } catch (error) {
    console.error(`Error inserting data to ${url}:`, error);
    throw new Error("Failed to insert data");
  }
};

export default useInsertData;
