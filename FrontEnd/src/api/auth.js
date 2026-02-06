import axios from "./axios";

export const googleAuth = (credential) =>
  axios.post(`/auth/google`, { credential });

export const verify = () => axios.get(`/auth/verify`);

export const logout = () => axios.post(`/auth/logout`);
