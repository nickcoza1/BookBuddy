import { get, post } from "./client";

export const register = ({ name, email, password }) =>
  post("/users/register", { json: { name, email, password } });

export const login = ({ email, password }) =>
  post("/users/login", { json: { email, password } });

export const getMe = (token) => get("/users/me", { token });
