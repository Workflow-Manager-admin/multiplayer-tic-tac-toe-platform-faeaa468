import React, { useState } from "react";
import "./AuthModal.css";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export default function AuthModal({ mode, open, onClose, onSuccess }) {
  /**
   * Minimal modal for Login or Signup.
   * @param mode "login" or "signup"
   * @param open show/hide
   * @param onClose close handler
   * @param onSuccess (optional) success handler for login/signup
   */
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const auth = useAuth();

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fn = mode === "signup" ? auth.signup : auth.login;
    const res = await fn(form);
    setBusy(false);
    if (res.success) {
      onSuccess && onSuccess();
      onClose();
    } else {
      setError(res.error || "Failed.");
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2>{mode === "signup" ? "Sign Up" : "Login"}</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            autoFocus
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
            disabled={busy}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            disabled={busy}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <button className="btn" type="submit" style={{background:"#1976D2",color:"white"}} disabled={busy}>
            {busy ? "Please wait…" : (mode === "signup" ? "Sign Up" : "Login")}
          </button>
          {error && <div className="modal-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
