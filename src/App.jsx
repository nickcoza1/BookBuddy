import { Routes, Route, Navigate, Link } from "react-router-dom";
import Books from "./routes/Books.jsx";
import BookDetails from "./routes/BookDetails.jsx";
import Account from "./routes/Account.jsx";
import Auth from "./routes/Auth.jsx";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="hero">
      <h2>404 — Not Found</h2>
      <p>
        Try heading back to the <Link to="/books">catalog</Link>.
      </p>
    </div>
  );
}