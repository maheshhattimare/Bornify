import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gift,
  Cake,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Loading from "../components/Loading";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({ email: "", otp: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (otpError) setOtpError("");
  };

  // Handle OTP send + verify
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpSent) {
      try {
        setSendingOtp(true);
        await API.post("/users/login", { email: formData.email });
        setOtpSent(true);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "Failed to send OTP. Please try again.";
        setOtpError(msg);
      } finally {
        setSendingOtp(false);
      }
    } else {
      try {
        setVerifying(true);
        const res = await API.post("/users/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Invalid OTP. Please try again.";
        setOtpError(msg);
      } finally {
        setVerifying(false);
      }
    }
  };

  // Google login
  const handleGoogleSuccess = async (response) => {
    try {
      setGoogleLoading(true);
      const res = await API.post("/users/google-login", {
        credential: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      setOtpError("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (googleLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200/30 dark:bg-pink-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200/30 dark:bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-yellow-200/30 dark:bg-yellow-500/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-pink-200/50 dark:border-purple-600/30 animate-in slide-in-from-bottom-4 duration-700">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 mx-auto">
                <Gift className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Cake className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
                <PartyPopper className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Bornify
              </h1>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Sign in to celebrate more birthdays
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4 text-pink-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                  placeholder="Enter your email address"
                  className={`w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-700/80 border-2 rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    otpSent
                      ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                      : "border-pink-200/50 dark:border-purple-600/30 focus:border-pink-400 dark:focus:border-purple-400 focus:ring-pink-400/20 dark:focus:ring-purple-400/20"
                  }`}
                  required
                />{" "}
                {otpSent && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}{" "}
              </div>
            </div>

            {/* OTP */}
            {otpSent && (
              <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Shield className="w-4 h-4 text-pink-500" />
                  <span>Verification Code</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={isShowPassword ? "text" : "password"}
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-2xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white text-center tracking-widest font-mono text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {isShowPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}{" "}
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {otpSent && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-2 border-emerald-200/60 dark:border-emerald-700/60 rounded-2xl p-4 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-800 dark:text-emerald-200 font-semibold mb-1">
                      🎯 OTP sent successfully!
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                      Check your email for the 6-digit code. It expires in 10
                      minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {otpError && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200/60 dark:border-red-700/60 rounded-2xl p-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-red-800 dark:text-red-200 font-medium flex-1">
                    {otpError}{" "}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                sendingOtp || verifying || (otpSent && formData.otp.length < 6)
              }
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Magic Code...</span>
                </>
              ) : verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : otpSent ? (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Verify & Sign In</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Verification Code</span>
                </>
              )}{" "}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/90 dark:bg-slate-800/90 text-gray-500 dark:text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setOtpError("Google login failed. Please try again.")
              }
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          {/* Switch to Signup */}
          <div className="text-center mt-8 p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              New to celebrating birthdays? 🎈{" "}
            </span>
            <Link
              to="/signup"
              className="text-pink-600 hover:text-purple-600 dark:text-pink-400 dark:hover:text-purple-400 font-bold transition-colors duration-300 hover:underline"
            >
              Join the party!
            </Link>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            🎂 Never miss a celebration again 🎉
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
