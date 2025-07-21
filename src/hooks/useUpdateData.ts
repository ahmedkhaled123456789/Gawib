import type { AxiosRequestConfig } from "axios";
import baseUrl from "../Api/baseURL";

export const useInUpdateDataWithImage = async (
  url: string,
  params: FormData
) => {
  const config: AxiosRequestConfig = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await baseUrl.put(url, params, config);
  console.log(res.status);
  return res;
};

// Generic update with typed response/request
export const useInUpdateData = async <TResponse = unknown, TRequest = unknown>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> => {
  try {
    const token = localStorage.getItem("token");

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...config?.headers,
      },
    };

    const response = await baseUrl.put<TResponse>(url, data, finalConfig);
    return response.data;
  } catch (error: any) {
    console.error(`PUT request failed for ${url}`, error);
    throw error;
  }
};
