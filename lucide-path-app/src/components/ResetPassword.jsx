import { useState, useContext } from "react";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { resetPasswordFinal } = useContext(AppContent);
  const [password, setPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    toast.error("Email not found. Restart process.");
    navigate("/forgot-password");
  }

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await resetPasswordFinal({ email, password });

      if (res.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal px-4">
      <div className="bg-teal/30 shadow-xl rounded-2xl p-8 w-full max-w-md border border-teal/50">
        <h2 className="text-3xl font-semibold text-center text-gold mb-2">
          Reset Password
        </h2>
        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative w-full mb-4 group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full py-3 px-0 text-white bg-transparent appearance-none border-0 border-b-2 border-gray-600 focus:border-gold focus:outline-none focus:ring-0 peer placeholder-transparent"
            />
            <label className="absolute text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0" htmlFor="password">
              New Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gold text-teal-900 py-3 rounded-lg font-semibold hover:bg-dark-gold transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
