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
        window.location.href = "/home";
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
      window.location.href = "/home";
    } catch (err) {
      setOtpError("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (googleLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
            <span className="text-white text-2xl">🎂</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Join Bornify and never miss a birthday again 🎉
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!otpSent && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* OTP Field */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showOtp ? "text" : "password"}
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white text-center tracking-widest font-mono transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {otpSent && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  OTP sent successfully! 🎉
                </p>
                <p className="text-green-600 dark:text-green-300 text-sm">
                  Check your email. OTP expires in 10 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {otpError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 font-medium">
                {otpError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              sendingOtp || verifying || (otpSent && formData.otp.length < 6)
            }
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-sm hover:shadow-md disabled:shadow-sm transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : otpSent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Sign Up</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Verification Code</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
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

          {/* Switch to Login */}
          <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
