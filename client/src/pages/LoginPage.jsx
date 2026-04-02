import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form);
      loginUser(data);
      navigate(data.user.role === "superadmin" ? "/admin/dashboard" : "/owner/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed");
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

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to manage your café empire</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
                placeholder="••••••••"
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
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="#" className={styles.forgot}>Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p className={styles.footer}>
          New here?{" "}
          <Link to="/signup" className={styles.link}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
