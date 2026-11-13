import axios from "axios";

let accessToken: string | null = null;
export function setAccessToken(token: string | null): void {
  accessToken = token;
}
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.endsWith("/auth/login")
    ) {
      window.dispatchEvent(new Event("opspilot-session-expired"));
    }
    return Promise.reject(error);
  },
);
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return "Unable to reach OpsPilot. Check your connection and try again.";
    if (error.response.status === 429)
      return "Too many attempts. Please wait a minute before trying again.";
    const body: unknown = error.response.data;
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    )
      return body.message;
    return "The request could not be completed. Please try again.";
  }
  return "An unexpected response was received. Please try again.";
}
