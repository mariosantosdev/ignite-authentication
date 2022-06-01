import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

import { signOut } from "../contexts/AuthContexts";

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${parseCookies()["auth.token"]}`,
  },
});
let isRefreshing = false;
let failedRequestedQueue = [];

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        const refreshToken = parseCookies()["auth.refreshToken"];
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post("/refresh", { refreshToken })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, "auth.token", token, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
              });

              setCookie(
                undefined,
                "auth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 30 * 24 * 60 * 60, // 30 days
                  path: "/",
                }
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              failedRequestedQueue.forEach((request) =>
                request.onSuccess(token)
              );
              failedRequestedQueue = [];
            })
            .catch((err) => {
              failedRequestedQueue.forEach((request) => request.onFailure(err));
              failedRequestedQueue = [];
            })
            .finally(() => (isRefreshing = false));
        }

        return new Promise((resolve, reject) => {
          failedRequestedQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => reject(err),
          });
        });
      } else {
        signOut();
      }
    }

    return Promise.reject(error);
  }
);
