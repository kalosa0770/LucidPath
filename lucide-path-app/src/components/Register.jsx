import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, CheckIcon } from "lucide-react";
import logo from "../../public/logo.png";
import axios from "axios";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowRight,  } from "lucide-react";

// ------------------- Tailwind shortcuts -------------------
const inputBase =
  "block w-full py-3 px-0 text-white bg-transparent appearance-none border-0 border-b-2 border-gray-600 focus:border-gold focus:outline-none focus:ring-0 peer placeholder-transparent";

const labelBase =
  "absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0";

// ------------------- Form Step Wrapper -------------------
const FormStepWrapper = ({ step, title, subtitle, children, onBack }) => (
  <div className="w-full max-w-md bg-[#062b2b] p-8 sm:p-10 rounded-2xl shadow-2xl relative text-white">
    {/* Step Progress */}
    <div className="flex justify-between w-full mb-8 space-x-2 pt-4">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`h-2 w-1/4 rounded-full ${s <= step ? "bg-gold shadow-inner" : "bg-gray-10"}`}
        ></div>
      ))}
    </div>

    <h1 className="text-3xl sm:text-4xl font-extrabold text-gold mb-2 text-center">{title}</h1>
    <p className="text-gray-400 mb-8 text-center">{subtitle}</p>
    {children}
    {step > 1 && (
      <button
        onClick={onBack}
        className="mt-6 mx-auto text-teal-400 border-b-2 border-gold hover:text-gold transition duration-150 flex items-center"
        aria-label="Go back to the previous step"
      >
        <ChevronLeftIcon className="w-6 h-6 mr-2" /> Go back
      </button>
    )}
  </div>
);

// ------------------- Step Components -------------------

// Step 0: User Type
const UserTypeStep = ({ onSelectClient }) => (
  <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
    <img src={logo} className="w-14 h-14 rounded-2xl mb-6" alt="Logo" />
    <h1 className="text-3xl sm:text-4xl text-gold font-extrabold text-center mb-10">
      Start your journey to mental wellness
    </h1>
    <div className="flex flex-col sm:flex-row gap-6 w-full">
      <Link
        className="flex flex-col items-center justify-center p-6 sm:p-8 w-full border-2 border-gold rounded-xl bg-transparent text-gold shadow-lg transition duration-300 hover:bg-gold hover:text-[#062b2b]"
        to={'../provider-register'}
      >
        <h2 className="text-2xl font-bold mb-1">Health Provider</h2>
        <p className="text-sm text-gray-400 transition duration-300">I provide health care</p>
      </Link>
      <button
        className="flex flex-col items-center justify-center p-6 sm:p-8 w-full border-2 border-gold rounded-xl bg-transparent text-gold shadow-lg transition duration-300 hover:bg-gold hover:text-[#062b2b]"
        onClick={onSelectClient}
      >
        <h2 className="text-2xl font-bold mb-1">Client</h2>
        <p className="text-sm text-gray-400 transition duration-300">I receive health care</p>
      </button>
    </div>
  </div>
);

// Step 1: Email
const EmailStep = ({ onNext, setFormData, formData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <FormStepWrapper
      step={1}
      title="Let's get started"
      subtitle="Your 30-day free trial awaits—no credit card needed!"
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-full mb-4 group">
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={inputBase}
            placeholder=" "
            required
          />
          <label className={labelBase}>Your Email Address</label>
        </div>
        <button type="submit" className="flex gap-2 w-full rounded-full items-center justify-center py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300">
          Next
          <ArrowRight />
        </button>
      </form>
    </FormStepWrapper>
  );
};

// Step 2: Name
const NameStep = ({ onNext, onBack, setFormData, formData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };
  return (
    <FormStepWrapper step={2} title="Who are you?" subtitle="Just a couple of details to personalize your experience." onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
        {["firstName", "lastName"].map((field, idx) => (
          <div key={idx} className="relative w-full mb-4 group">
            <input
              type="text"
              value={formData[field] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              className={inputBase}
              placeholder=" "
              required
            />
            <label className={labelBase}>{field === "firstName" ? "First Name" : "Last Name"}</label>
          </div>
        ))}
        <div className="relative w-full mb-4 group">
          <input
            type="tel"
            value={formData.phoneNumber || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className={inputBase}
            placeholder=" "
            required
          />
          <label className={labelBase}>Phone Number</label>
        </div>
        <button type="submit" className="flex gap-2 w-full items-center justify-center rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300">
          Next
          <ArrowRight />
        </button>
      </form>
    </FormStepWrapper>
  );
};

// Step 3: Status
const StatusStep = ({ onNext, onBack, setFormData, formData }) => {
  const statuses = ["Student", "Working Professional", "Other"];
  const handleSelect = (status) => {
    setFormData(prev => ({ ...prev, userStatus: status }));
    onNext();
  };
  const isSelected = (status) => formData.userStatus === status;

  return (
    <FormStepWrapper step={3} title="What's your status?" subtitle="This helps us recommend the most relevant resources." onBack={onBack}>
      <div className="flex flex-col gap-4 w-full">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleSelect(status)}
            className={`flex justify-between items-center p-4 w-full rounded-xl border-2 transition duration-300 ${
              isSelected(status)
                ? "bg-gold border-gold text-[#062b2b] shadow-lg"
                : "bg-transparent border-gray-600 text-white hover:border-gold"
            }`}
          >
            <span className="text-lg font-semibold">{status}</span>
            {isSelected(status) && <CheckIcon className="w-6 h-6 text-[#062b2b]" />}
          </button>
        ))}
      </div>
    </FormStepWrapper>
  );
};

// Step 4: Password + Registration
const PasswordStep = ({ onBack, setFormData, formData, onRegister }) => {
  const { backendUrl, setIsLoggedin } = useContext(AppContent);
  const [password, setPassword] = useState(formData.password || "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordStrength = (p) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthText = strength === 4 ? "Strong" : strength >= 2 ? "Medium" : "Weak";
  const strengthColor = strength === 4 ? "text-green-500" : strength >= 2 ? "text-yellow-500" : "text-red-500";
  const barColor = strength === 4 ? "bg-green-500" : strength >= 2 ? "bg-yellow-500" : "bg-red-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 2) return toast.error("Password must be at least medium strength.");

    setFormData(prev => ({ ...prev, password }));
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/auth/register`, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || "",
        userStatus: formData.userStatus,
        password
      }, { withCredentials: true });

      if (res.data.success) {
        setIsLoggedin(true);
        toast.success(`Welcome ${formData.firstName || "User"}, registration complete!`, {
          style: { background: "#FFD700", color: "#062b2b" }
        });
        onRegister();
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormStepWrapper step={4} title="Secure your account" subtitle="Create a strong password to protect your privacy." onBack={onBack}>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-full mb-4 group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputBase}
            placeholder=" "
            required
          />
          <label className={labelBase}>Password</label>
        </div>
        <div className="w-full text-left text-sm">
          <div className="h-1 bg-gray-700 rounded-full mb-1">
            <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${(strength/4)*100}%` }}></div>
          </div>
          <p className={`font-semibold ${strengthColor}`}>
            Strength: {strengthText} {strength < 4 && <span className="text-gray-400">(8+ chars, Upper, Lower, Number)</span>}
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "" : "Finish Registration"}
        </button>
      </form>
    </FormStepWrapper>
  );
};

// Step 5: Completion
const CompletionStep = ({ formData }) => (
  <div className="w-full max-w-md bg-[#062b2b] p-12 rounded-2xl shadow-2xl text-center text-white">
    <h1 className="text-4xl font-extrabold text-gold mb-4">Registration Complete!</h1>
    <p className="text-lg text-gray-400">
      Welcome, {formData.firstName || 'New User'}! You are now ready to start your 30-day free trial.
    </p>
    <Link to='/login'>
      <button className="bg-gold text-[#062b2b] rounded-full py-3 px-8 text-lg font-bold shadow-md transition duration-300 hover:bg-[#FFD700]/80 mt-8">
        Go to Login
      </button>
    </Link>
  </div>
);

// ------------------- Main Register Component -------------------
const Register = () => {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleSelectClient = () => setCurrentStep(1);
  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);
  const handleComplete = () => setCurrentStep(5);

  

  const renderStep = () => {
    const stepProps = { onNext: handleNext, onBack: handleBack, setFormData, formData };
    switch (currentStep) {
      case 0: return <UserTypeStep onSelectClient={handleSelectClient} />;
      case 1: return <EmailStep {...stepProps} />;
      case 2: return <NameStep {...stepProps} />;
      case 3: return <StatusStep {...stepProps} />;
      case 4: return <PasswordStep {...stepProps} onRegister={handleComplete} />;
      case 5: return <CompletionStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#0a1f1f] font-nunito p-4">
      <div className="absolute top-0 w-full max-w-7xl flex justify-start py-6 px-4">
        <h1 className="text-3xl font-extrabold text-gold">Lucid Path</h1>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {renderStep()}
      </div>
    </div>
  );
};

export default Register;
