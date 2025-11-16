import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const HealthProviderRegister = () => {
  const { backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    profession: "",      // <-- added profession here
    licenseNumber: "",
    experience: "",
    bio: "",
    profile: null,
  });

  const input =
    "w-full px-3 py-3 bg-transparent border-b-2 border-gray-600 text-white focus:border-gold outline-none";
  const label = "text-gray-400 text-sm";

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleImageUpload = (e) => {
    setFormData({ ...formData, profile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 2) return toast.error("Password must be at least medium strength.");
    
        setFormData(prev => ({ ...prev, password }));
        setLoading(true);

    try {
      const providerForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        providerForm.append(key, value);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/providers/register`,
        providerForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Provider account created!", {
          style: { background: "#FFD700", color: "#062b2b" },
        });
        window.location.href = "/provider/login";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#0a1f1f] flex items-center justify-center p-4 font-nunito">
      <div className="w-full max-w-xl bg-[#062b2b] p-8 rounded-2xl shadow-2xl">

        {/* ---------------- PROGRESS SECTION ---------------- */}
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center w-full">
              <div
                className={`h-2 w-1/2 rounded-full 
                ${
                  step >= s
                    ? "bg-gold shadow-inner"
                    : "bg-gray/10"
                }`}
              >
                {/* {step > s ? <Check size={20} /> : s} */}
              </div>
              
            </div>
          ))}
        </div>

        {/* ---------------- STEP 1: PERSONAL INFO ---------------- */}
        {step === 1 && (
          <form className="space-y-6 text-white" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-3xl font-extrabold text-gold mb-6">
              Personal Information
            </h1>

            <div>
              <label className={label}>First Name</label>
              <input
                type="text"
                required
                className={input}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className={label}>Last Name</label>
              <input
                type="text"
                required
                className={input}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                required
                className={input}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className={label}>Phone Number</label>
              <input
                type="tel"
                required
                className={input}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-4 bg-gold text-[#062b2b] py-3 rounded-full text-lg font-extrabold flex justify-center items-center gap-2"
            >
              Next <ArrowRight />
            </button>
          </form>
        )}

        {/* ---------------- STEP 2: PROFESSIONAL DETAILS ---------------- */}
        {step === 2 && (
          <form className="space-y-6 text-white" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-3xl font-extrabold text-gold mb-6">
              Professional Details
            </h1>

            {/* Profession select */}
            <div>
              <label className={label}>Profession</label>
              <select
                required
                className={`${input} appearance-none bg-transparent`}
                value={formData.profession}
                onChange={(e) =>
                  setFormData({ ...formData, profession: e.target.value })
                }
              >
                <option value="" className="bg-[#062b2b] text-gray-300">Select profession</option>
                <option value="Therapist" className="bg-[#062b2b]">Therapist</option>
                <option value="Psychologist" className="bg-[#062b2b]">Psychologist</option>
                <option value="Psychiatrist" className="bg-[#062b2b]">Psychiatrist</option>
                <option value="Counselor" className="bg-[#062b2b]">Counselor</option>
                <option value="Social Worker" className="bg-[#062b2b]">Social Worker</option>
                <option value="Other" className="bg-[#062b2b]">Other</option>
              </select>
            </div>

            <div>
              <label className={label}>License Number</label>
              <input
                type="text"
                required
                className={input}
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licenseNumber: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className={label}>Years of Experience</label>
              <input
                type="number"
                required
                min="0"
                className={input}
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className={label}>Bio</label>
              <textarea
                required
                rows="4"
                className={`${input} border rounded-lg p-3`}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              ></textarea>
            </div>

            <div className="text-gold">
              <label className={label}>Upload Profile Photo: </label>
              <input
                type="file"
                accept="image/*"
                className="text-white mt-2"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-700 text-white rounded-full flex items-center gap-2"
              >
                <ArrowLeft /> Back
              </button>

              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gold text-[#062b2b] rounded-full flex items-center gap-2"
              >
                Next <ArrowRight />
              </button>
            </div>
          </form>
        )}

        {/* ---------------- STEP 3: ACCOUNT SECURITY ---------------- */}
        {step === 3 && (
          <form className="space-y-6 text-white" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-extrabold text-gold mb-6">
              Account Security
            </h1>

            <div>
              <label className={label}>Password</label>
              <input
                type="password"
                required
                className={input}
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-700 text-white rounded-full flex items-center gap-2"
              >
                <ArrowLeft /> Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gold text-[#062b2b] rounded-full font-extrabold flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Finish <Check />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HealthProviderRegister;
