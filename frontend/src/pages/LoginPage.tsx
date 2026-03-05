import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore.ts";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader, Eye, EyeOff } from "lucide-react";

const IRAQI_PHONE_REGEX = /^07[0-9]{9}$/;

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const loading = useUserStore((state) => state.loading);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError("");
      return;
    }
    if (!IRAQI_PHONE_REGEX.test(value)) {
      setPhoneError("Please enter a valid Iraqi phone number (07XXXXXXXXX)");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!IRAQI_PHONE_REGEX.test(phone)) {
      setPhoneError("Please enter a valid Iraqi phone number (07XXXXXXXXX)");
      return;
    }

    const success = await login(phone, password);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen min-w-screen">
      <div className="bg-white rounded-lg shadow-lg p-10 w-[550px]">
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
              disabled={loading}
              onChange={(e) => {
                setPhone(e.target.value);
                validatePhone(e.target.value);
              }}
              onBlur={(e) => validatePhone(e.target.value)}
              placeholder="07501234567"
              className={`bg-gray-50 border placeholder:text-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                phoneError
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-200 focus:ring-red-800"
              }`}
            />
            {phoneError && (
              <p className="text-red-600 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div className="flex flex-col mb-6">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                required
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border placeholder:text-gray-400 border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
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

        <p className="text-sm text-gray-400 text-center mt-6">
          Use "07xx xxx xxxx" for Super Admin or any other phone number for
          Admin
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
