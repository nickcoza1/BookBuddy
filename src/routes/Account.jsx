import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { myReservations, returnReservation } from "../api/reservations";
import { Link } from "react-router-dom";

export default function Account() {
  const { user, token, loading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!token) return;
    myReservations(token)
      .then(setReservations)
      .catch(e => setErr(e.message));
  }, [token]);

  if (loading) return <p>Loading account…</p>;
  if (!user) {
    return (
      <div className="hero">
        <p>You’re not logged in. <Link to="/auth">Log in or register</Link>.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>My Account</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <p><strong>Name:</strong> {user.name || "—"}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3>My Reservations</h3>
      {err && <p style={{ color: "salmon" }}>{err}</p>}
      {!reservations.length ? <p>No reservations yet.</p> : (
        <table className="table">
          <thead><tr><th>Title</th><th>Author</th><th>Reserved On</th><th></th></tr></thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.book?.title || r.title}</td>
                <td>{r.book?.author || r.author}</td>
                <td>{new Date(r.createdAt || r.created_at || Date.now()).toLocaleString()}</td>
                <td>
                  <button className="btn" disabled={busy === r.id}
                    onClick={async () => {
                      setBusy(r.id);
                      try {
                        await returnReservation({ reservationId: r.id, token });
                        setReservations(prev => prev.filter(x => x.id !== r.id));
                      } finally { setBusy(""); }
                    }}>
                    {busy === r.id ? "Returning…" : "Return"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
