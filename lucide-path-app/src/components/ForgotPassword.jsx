import { useState, useContext } from "react";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const { sendPasswordResetOtp } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("enterEmail");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // Step 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await sendPasswordResetOtp(email);

      if (res.success) {
        toast.success("OTP sent to your email!");
        setStep("enterOtp");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-reset-otp`,
        { email, otp }
      );

      if (data.success) {
        toast.success("OTP verified!");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal px-4">
      <div className="bg-teal/30 shadow-xl rounded-2xl p-8 w-full max-w-md border border-teal/50">
        
        <h2 className="text-3xl font-semibold text-center text-gold mb-2">
          Forgot Password
        </h2>
        <p className="text-white text-center mb-8">
          {step === "enterEmail"
            ? "Enter your email to receive an OTP."
            : "Enter the OTP sent to your email."}
        </p>

        {/* ENTER EMAIL */}
        {step === "enterEmail" && (
          <form onSubmit={handleSendOtp} className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-full mb-4 group">
              <input
                type="email"
                className="block w-full py-3 px-0 text-white bg-transparent appearance-none border-0 border-b-2 border-gray-600 focus:border-gold focus:outline-none focus:ring-0 peer placeholder-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="absolute text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0">Email</label>
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold/60 text-white py-3 rounded-xl font-semibold 
                         transition shadow-md hover:shadow-lg"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* ENTER OTP */}
        {step === "enterOtp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-1">Enter OTP</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                           focus:border-yellow-400 focus:ring-2 focus:ring-yellow-600 outline-none transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold 
                         transition shadow-md hover:shadow-lg"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
