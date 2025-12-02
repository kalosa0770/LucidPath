import { useState, useContext, useEffect, useRef } from "react";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// axios removed - not needed here
import OTPInput from "./OTPInput";

const ForgotPassword = () => {
  const { sendPasswordResetOtp, verifyPasswordResetOTP } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("enterEmail");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // resend state
  const OTP_LENGTH = 6;
  const RESEND_SECONDS = 60; // cooldown before resend
  const [resendTimer, setResendTimer] = useState(0);
  const resendIntervalRef = useRef(null);

  const navigate = useNavigate();

  // Step 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await sendPasswordResetOtp(email);

      if (res.success) {
        toast.success("OTP sent to your email!");
        setStep("enterOtp");
        setResendTimer(RESEND_SECONDS);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // start/stop resend countdown
  useEffect(() => {
    if (resendTimer <= 0) {
      // cleanup interval
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = null;
      }
      return;
    }

    // if timer > 0 and interval not set, start one
    if (!resendIntervalRef.current) {
      resendIntervalRef.current = setInterval(() => {
        setResendTimer((s) => {
          if (s <= 1) {
            clearInterval(resendIntervalRef.current);
            resendIntervalRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
        resendIntervalRef.current = null;
      }
    };
  }, [resendTimer]);

  // Step 2 - Verify OTP
  // shared verification function that can be called from form submit
  const verifyOtp = async (targetOtp) => {
    const code = targetOtp ?? otp;
    if (!email) return toast.error("Email is missing");
    if (!code || code.length < OTP_LENGTH) return; // don't verify until full
    if (isVerifying) return; // avoid duplicate

    setIsVerifying(true);
    try {
      const data = await verifyPasswordResetOTP(email, code);

      if (data.success) {
        toast.success("OTP verified! redirecting to reset password.");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    await verifyOtp();
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
          <form onSubmit={handleVerifyOtp} className="flex flex-col items-center gap-6 w-full">
            <div className="w-full mb-2">
              <label className="text-white block text-sm mb-2">Enter OTP</label>
              {/* OTPInput is a per-digit input component - renders 6 single-character inputs */}
              <div className="flex justify-center">
                <OTPInput
                  length={OTP_LENGTH}
                  value={otp}
                  onChange={(v) => setOtp(v)}
                  onComplete={(val) => verifyOtp(val)}
                  autoFocus
                />
              </div>
            </div>

            <div className="w-full text-center text-sm text-gray-200">
              {resendTimer > 0 ? (
                <p>
                  Didn't get the code? Resend in <strong>{resendTimer}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  className="text-gold hover:underline"
                  onClick={async () => {
                    // resend OTP
                    if (!email) return toast.error("Email is missing");
                    try {
                      const res = await sendPasswordResetOtp(email);
                      if (res.success) {
                        toast.success("OTP resent to your email.");
                        setResendTimer(RESEND_SECONDS);
                      } else {
                        toast.error(res.message || "Could not resend OTP");
                      }
                    } catch (err) {
                      toast.error(err.message);
                    }
                  }}
                >
                  Resend OTP
                </button>
              )}
              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm text-gray-300 hover:underline"
                  onClick={() => {
                    setStep("enterEmail");
                    setOtp("");
                    setResendTimer(0);
                    if (resendIntervalRef.current) {
                      clearInterval(resendIntervalRef.current);
                      resendIntervalRef.current = null;
                    }
                  }}
                >
                  Change email
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gold hover:bg-gold/60 text-white py-3 rounded-xl font-semibold 
              transition shadow-md hover:shadow-lg"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
