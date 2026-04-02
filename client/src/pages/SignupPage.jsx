import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";

const SignupPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ cafeName: "", ownerName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isStrongPassword(form.password)) {
      setError("Password must be 8+ chars with uppercase, lowercase, number, and special character.");
      return;
    }
    setLoading(true);
    try {
      const data = await signup(form);
      loginUser(data);
      navigate("/owner/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>Go Back</span>
      </Link>

      <div className={styles.card} style={{ maxWidth: '460px' }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join hundreds of café owners scaling with Café OS</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Café Name</label>
              <input
                name="cafeName"
                placeholder="The Coffee Spot"
                value={form.cafeName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Your Name</label>
              <input
                name="ownerName"
                placeholder="Full name"
                value={form.ownerName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passWrap}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eye}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#8C7E74', marginTop: '0.4rem', lineHeight: '1.4' }}>
              Must include uppercase, lowercase, number, and symbol.
            </p>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Creating your empire..." : "Start 14-Day Free Trial"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
