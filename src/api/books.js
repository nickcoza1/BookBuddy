import { get } from "./client";
export const listBooks = () => get("/books");
export const getBook = (id) => get(`/books/${id}`);
