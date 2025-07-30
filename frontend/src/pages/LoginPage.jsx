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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center shadow-md mx-auto">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <Cake className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                Bornify
              </h1>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome Back! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to celebrate more birthdays
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    otpSent
                      ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  }`}
                  required
                />
                {otpSent && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* OTP */}
            {otpSent && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Verification Code</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={isShowPassword ? "text" : "password"}
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white text-center tracking-widest font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {isShowPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {otpSent && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-800 dark:text-green-200 font-medium mb-1">
                      🎯 OTP sent successfully!
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Check your email for the 6-digit code. It expires in 10
                      minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {otpError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-red-800 dark:text-red-200 font-medium flex-1">
                    {otpError}
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
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-sm hover:shadow-md disabled:shadow-sm transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : otpSent ? (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Verify & Sign In</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div>
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
          <div className="text-center mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400">
              New to celebrating birthdays? 🎈{" "}
            </span>
            <Link
              to="/signup"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Join the party!
            </Link>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            🎂 Never miss a celebration again 🎉
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
