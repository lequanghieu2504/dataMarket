import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DatabaseIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  UserIcon,
} from "lucide-react";
import useSignup from "../hooks/useSignup";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { signupMutation, isPending, error } = useSignup();

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred during signup");
    }
  }, [error]);

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="">
      {/* Main Card */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
        {/* Signup Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="relative">
              <DatabaseIcon className="w-10 h-10 text-indigo-600 drop-shadow-lg" />
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-md"></div>
            </div>
            <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 tracking-wider">
              DataMarket
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 flex-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                {error.response?.data?.message ||
                  error.message ||
                  "An error occurred during signup"}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Create your account
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Join DataMarket to discover, buy, and sell datasets
              </p>
            </div>

            <div className="space-y-5">
              {/* Full name */}
              <div className="w-full">
                <label className="block mb-1 text-sm font-semibold text-gray-700 text-left">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition-all"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    autoComplete="name"
                    disabled={isPending}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="w-full">
                <label className="block mb-1 text-sm font-semibold text-gray-700 text-left">
                  Email Address
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition-all"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    autoComplete="email"
                    disabled={isPending}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="w-full">
                <label className="block mb-1 text-sm font-semibold text-gray-700 text-left">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition-all"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    autoComplete="new-password"
                    disabled={isPending}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-left">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    disabled={isPending}
                    required
                  />
                  <span className="text-gray-700">
                    I agree to terms and privacy
                  </span>
                </label>
              </div>

              {/* Button */}
              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl py-3 transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-3">
                <p className="text-base">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all duration-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section with Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-indigo-50 via-violet-50 to-cyan-50 items-center justify-center relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-violet-200 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-cyan-200 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-md p-8 text-center relative z-10">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-violet-300 opacity-60 rounded-full blur-3xl"></div>
              <img
                src="/banner.jpeg"
                alt="Illustration"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-fadeIn"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Join the marketplace for quality datasets
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Buy and sell reliable data. Manage purchases and uploads in one
                place.
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium shadow-sm">
                  Secure Payments
                </span>
                <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-medium shadow-sm">
                  API Access
                </span>
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 font-medium shadow-sm">
                  Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SignupPage;
