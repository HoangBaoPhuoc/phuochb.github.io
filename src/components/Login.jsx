import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Section from "./Section";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/restricted");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        // Redirect to restricted page on successful login
        navigate("/restricted");
      } else {
        setError(result.message);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section
      id="login"
      className="min-h-screen flex items-center justify-center pt-20"
    >
      <div className="w-full max-w-2xl p-12 glass-panel rounded-3xl border border-white/10">
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-blue-500/10 rounded-full mb-6 text-blue-400">
            <Lock size={48} />
          </div>
          <h2 className="text-4xl font-bold text-white">Restricted Access</h2>
          <p className="text-gray-400 mt-3 text-lg">
            Please identify yourself to proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-lg text-gray-400 font-medium ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors duration-300 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-3">
            <label className="text-lg text-gray-400 font-medium ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors duration-300 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Authenticate</span>
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 font-mono">
          System ID: 25VN506270HOAB028A <br />
          Secure Connection Encrypted
        </div>
      </div>
    </Section>
  );
}
