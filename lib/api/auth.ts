import { api } from "./client";

export const signup = async (data: { email: string; password: string }) => {
  const response = await api.post("/api/signup", data);
  return response.data;
};

