import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axiosInstance";
import { useAuthStore } from "../context/authStore";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setUser(data.user);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error: unknown ) {
      if (axios.isAxiosError(error))
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      side="right"
      welcomeTitle="Join the portal."
      welcomeDescription="Access exclusive high-value properties and personalized real estate services."
    >
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-brand-muted text-sm">
            Start your property journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-800 border border-brand-600 rounded-lg px-4 py-3 text-white placeholder-brand-500 focus:outline-none focus:border-white transition-colors text-sm"
              placeholder="e.g. Eddie Murphy"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-800 border border-brand-600 rounded-lg px-4 py-3 text-white placeholder-brand-500 focus:outline-none focus:border-white transition-colors text-sm"
              placeholder="e.g. eddie@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-800 border border-brand-600 rounded-lg px-4 py-3 text-white placeholder-brand-500 focus:outline-none focus:border-white transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-brand-light transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
