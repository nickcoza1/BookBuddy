import { get, post, del } from "./client";

export const myReservations = (token) => get("/reservations", { token });

export const reserveBook = ({ bookId, token }) =>
  post("/reservations", { token, json: { bookId } });

export const returnReservation = ({ reservationId, token }) =>
  del(`/reservations/${reservationId}`, { token });
