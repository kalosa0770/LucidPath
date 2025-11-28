import { useState, useContext } from "react";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { handlePasswordReset } = useContext(AppContent);
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
      const res = await handlePasswordReset({ email, password });

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
    <div className="container">
      <h2>Reset Your Password</h2>

      <form onSubmit={handleReset}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
