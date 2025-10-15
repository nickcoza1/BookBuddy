import { useEffect, useState } from "react";
import { listBooks } from "../api/books";
import { Link } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    listBooks()
      .then(data => { if (alive) setBooks(data); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    return () => { alive = false; };
  }, []);

  if (loading) return <p>Loading books…</p>;
  if (error) return <p style={{ color: "salmon" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Catalog</h2>
      <div className="grid">
        {books.map(b => (
          <div className="card" key={b.id}>
            {b.coverimage ? (
              <img src={b.coverimage} alt={b.title}
                   style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} />
            ) : <div style={{height:220,border:"1px dashed rgba(255,255,255,.2)",borderRadius:12,display:"grid",placeItems:"center",marginBottom:10}}>No Cover</div>}
            <h3 style={{ margin: "6px 0 2px" }}>{b.title}</h3>
            <p style={{ opacity: .85, margin: 0 }}>{b.author}</p>
            <div style={{ height: 8 }} />
            <Link className="btn" to={`/books/${b.id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
