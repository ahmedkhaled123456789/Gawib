import { AxiosRequestConfig, AxiosError } from "axios";
import baseUrl from "../Api/baseURL";

const useDeleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    // Combine provided headers with the default Authorization header
    const token = localStorage.getItem("token");
    const defaultConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // Only set Authorization if token is available
        ...config?.headers, // Merge any additional headers from the config
      },
    };

    // Perform the DELETE request
    const res = await baseUrl.delete<T>(url, defaultConfig);
    return res.data; // Return the response data
  } catch (error) {
    // Check if error is an Axios error and handle accordingly
    if (error instanceof AxiosError) {
      console.error(
        `Error deleting data from ${url}: ${
          error.response?.data || error.message
        }`
      );
      throw new Error(
        `Failed to delete data: ${
          error.response?.statusText || "Unknown error"
        }`
      );
    } else {
      console.error(`Unexpected error deleting data from ${url}:`, error);
      throw new Error(
        "An unexpected error occurred during the delete request."
      );
    }
  }
};

export default useDeleteData;
