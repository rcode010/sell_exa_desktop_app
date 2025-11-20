import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore.ts";
import { ArrowRight, Loader } from "lucide-react";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useUserStore() as {
    login: (phone: string, password: string) => void;
    loading: boolean;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(phone, password);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen min-w-screen">
      <div className="bg-white rounded-lg shadow-lg p-10 w-[550px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-800 rounded-xl p-4">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-red-800 text-center mb-2">
          Sellexa
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="bg-gray-50 border  placeholder:text-gray-400 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col mb-6">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border placeholder:text-gray-400 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-gray-900 via-black to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-black/30 hover:shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-30 transition-opacity"></div>
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Use "07xx xxx xxxx" for Super Admin or any other phone number for
          Admin
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
