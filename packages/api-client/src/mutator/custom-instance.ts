import Axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const getBaseUrl = () => {
  return "http://localhost:3000/proxy";
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (!isUnauthorized || isRefreshRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            resolve(AXIOS_INSTANCE(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const baseUrl = typeof window === "undefined" ? getBaseUrl() : "/proxy";

      await fetch(`${baseUrl}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      processQueue();

      return AXIOS_INSTANCE(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const headers: Record<string, string> = {};

  // SSR
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");

    headers.Cookie = (await cookies()).toString();
  }

  return AXIOS_INSTANCE({
    ...config,
    ...options,
    headers: {
      ...headers,
      ...config.headers,
      ...options?.headers,
    },
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
