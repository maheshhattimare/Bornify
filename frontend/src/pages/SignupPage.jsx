import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gift,
  Cake,
  PartyPopper,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (otpError) setOtpError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpSent) {
      // Step 1: Send OTP
      try {
        setSendingOtp(true);
        await API.post("/users/signup", {
          name: formData.name,
          dob: formData.dob,
          email: formData.email,
        });
        setOtpSent(true);
      } catch (err) {
        setOtpError(err?.response?.data?.message || "Failed to send OTP");
      } finally {
        setSendingOtp(false);
      }
    } else {
      // Step 2: Verify OTP
      try {
        setVerifying(true);
        const res = await API.post("/users/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } catch (err) {
        setOtpError(err?.response?.data?.message || "Invalid OTP");
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setGoogleLoading(true);
      const res = await API.post("/users/google-login", {
        credential: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setOtpError("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (googleLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 transition-colors duration-300">
      {/* Floating Birthday Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-pink-200 dark:text-pink-800 opacity-60 animate-bounce">
          <Gift className="w-8 h-8" />
        </div>
        <div className="absolute top-32 right-16 text-purple-200 dark:text-purple-800 opacity-60 animate-pulse">
          <Cake className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 left-20 text-indigo-200 dark:text-indigo-800 opacity-60 animate-bounce delay-300">
          <PartyPopper className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 right-12 text-pink-200 dark:text-pink-800 opacity-60 animate-pulse delay-700">
          <Gift className="w-5 h-5" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 animate-fadeIn bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 transition-all duration-300">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <span className="text-white text-2xl font-bold filter drop-shadow-sm">
              🎂
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Join Bornify and never miss a birthday again 🎉
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!otpSent && (
            <div className="space-y-5">
              {/* Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* OTP Field */}
          {otpSent && (
            <div className="group animate-slideDown">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                <input
                  type={showOtp ? "text" : "password"}
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-white text-center tracking-widest font-mono text-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}{" "}
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {otpSent && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-4 flex items-start gap-3 animate-slideDown">
              <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 animate-pulse" />
              <div>
                <p className="text-emerald-800 dark:text-emerald-200 font-semibold">
                  OTP sent successfully! 🎉
                </p>
                <p className="text-emerald-600 dark:text-emerald-300 text-sm">
                  Check your email. OTP expires in 10 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {otpError && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700/50 rounded-2xl p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 animate-pulse" />
              <p className="text-red-800 dark:text-red-200 font-semibold">
                {otpError}{" "}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              sendingOtp || verifying || (otpSent && formData.otp.length < 6)
            }
            className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : verifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : otpSent ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verify & Sign Up</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Send Verification Code</span>
              </>
            )}{" "}
          </button>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setOtpError("Google login failed. Please try again.")
                }
                theme="outline"
                size="large"
                width="300"
                logo_alignment="left"
              />
            </div>
          </div>

          {/* Switch to Login */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 relative group"
            >
              Sign in
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
