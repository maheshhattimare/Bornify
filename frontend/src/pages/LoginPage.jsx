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

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <div className="max-w-md w-full space-y-8 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">🎂</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your Birthday Reminder account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
                placeholder="Enter your email"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* OTP */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="input-field pl-10 pr-10 text-center tracking-widest font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {isShowPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {otpSent && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <div>
                <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                  OTP sent successfully!
                </p>
                <p className="text-emerald-600 dark:text-emerald-300 text-sm">
                  Check your email for the 6-digit code. It expires in 10
                  minutes.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {otpError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
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
            className="w-full btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...
              </>
            ) : verifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
              </>
            ) : otpSent ? (
              <>
                <Shield className="w-5 h-5" /> Verify & Sign In
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" /> Send Verification Code
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setOtpError("Google login failed. Please try again.")}
          theme="outline"
          size="large"
          width="100%"
        />

        {/* Switch to Signup */}
        <div className="text-center mt-4">
          <span className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
          </span>
          <Link
            to="/signup"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
