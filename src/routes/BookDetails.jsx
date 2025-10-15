import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBook } from "../api/books";
import { reserveBook } from "../api/reservations";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getBook(id)
      .then(setBook)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "salmon" }}>Error: {error}</p>;
  if (!book) return null;

  const canReserve = !!user && !!token && book.available;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{book.title}</h2>
      <p style={{ opacity: .85 }}>{book.author}</p>
      {book.coverimage && (
        <img src={book.coverimage} alt={book.title}
             style={{ width: "100%", maxWidth: 420, borderRadius: 12 }} />
      )}
      <p style={{ marginTop: 12 }}>{book.description || "No description."}</p>
      <p>
        Status:{" "}
        <span className="badge" style={{ background: book.available ? "rgba(146,255,179,.1)" : "rgba(255,146,146,.08)" }}>
          {book.available ? "Available" : "Reserved"}
        </span>
      </p>

      {user ? (
        <button
          className="btn"
          disabled={!canReserve || reserving}
          onClick={async () => {
            setReserving(true);
            try {
              await reserveBook({ bookId: book.id, token });
              setBook({ ...book, available: false }); // disable after reserve
              alert("Reserved!");
            } catch (e) {
              alert(e.message || "Failed to reserve");
            } finally { setReserving(false); }
          }}
        >
          {book.available ? (reserving ? "Reserving…" : "Reserve") : "Unavailable"}
        </button>
      ) : (
        <p><em>Log in to reserve this book.</em></p>
      )}
    </div>
  );
}
