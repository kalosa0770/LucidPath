import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // for redirect

const inputBase = "block w-full py-3 px-0 text-white bg-transparent appearance-none border-0 border-b-2 border-gray-600 focus:border-gold focus:outline-none focus:ring-0 peer placeholder-transparent";
const labelBase = "absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0";

const professions = [
  "Psychologist",
  "Therapist",
  "Counselor",
  "Psychiatric Nurse",
  "Social Worker",
];

const ProfessionSelect = ({ value, onChange }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative w-full mb-6">
      <label className="text-gray-400 mb-1 block">Profession</label>
      <Listbox.Button className={inputBase}>
        <span className="block truncate text-start">{value || "Select Profession"}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </span>
      </Listbox.Button>
      <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-white shadow-xl border-2 border-teal z-20">
        {professions.map((prof, index) => (
          <Listbox.Option
            key={index}
            value={prof}
            className={({ active }) =>
              `cursor-pointer select-none py-2 px-4 ${active ? "bg-teal text-white" : "text-teal"}`
            }
          >
            {({ selected }) => <span className={`block truncate ${selected ? "font-bold" : ""}`}>{prof}</span>}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

const ProviderRegister = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [registering, setRegistering] = useState(false); // spinner for registration
  const [profileUrl, setProfileUrl] = useState("");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", licenseNumber: "", experience: "",
    profession: "", bio: "",
  });
  const [passwordRules, setPasswordRules] = useState({ length:false, uppercase:false, number:false, special:false });

  useEffect(() => setPasswordRules(validatePassword(formData.password)), [formData.password]);

  const validatePassword = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dn7esger9/image/upload`, { method: "POST", body: data });
      const fileData = await res.json();
      setProfileUrl(fileData.secure_url);
      toast.success("Profile uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Profile upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileUrl) return toast.error("Please upload a profile photo");

    setRegistering(true);
    try {
      const res = await axios.post(`${backendUrl}/api/providers/register`, { ...formData, profile: profileUrl });
      console.log(res.data);
      toast.success("Registration successful! Redirecting to login...", { autoClose: 3000, onClose: () => navigate("/login") });
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#0a1f1f] font-nunito p-4">
      
      <div className="w-full max-w-xl bg-white/10 p-8 rounded-xl shadow-lg">
        {/* PROGRESS STEPS */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map(n => (
            <div key={n} className={`flex items-center justify-center h-2 w-1/4 text-white rounded-full ${n <= step ? "bg-teal shadow-inner" : "bg-gray"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4 text-white">
              <h2 className="text-xl font-bold text-gold">Personal Information</h2>
              <div className="relative w-full mb-4 group">
                <input type="text" name="firstName" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>First Name</label>
              </div>
              <div className="relative w-full mb-4 group">
                <input type="text" name="lastName" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>Last Name</label>
              </div>
              <div className="relative w-full mb-4 group">
                <input type="email" name="email" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>Email</label>
              </div>
              <div className="relative w-full mb-4 group">
                <input type="text" name="phone" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>Phone Number</label>
              </div>
              <button type="button" className="w-full bg-teal text-white py-2 rounded" onClick={nextStep}>Next</button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4 text-white">
              <h2 className="text-xl font-bold text-gold">Professional Details</h2>
              <div className="relative w-full mb-4 group">
                <input type="text" name="licenseNumber" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>License Number</label>
              </div>
              <div className="relative w-full mb-4 group">
                <input type="number" name="experience" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>Years of Experience</label>
              </div>
              <ProfessionSelect value={formData.profession} onChange={(val) => setFormData({ ...formData, profession: val })} />
              <div className="relative w-full mb-4 group">
                <textarea name="bio" onChange={handleChange} className={inputBase} placeholder=" "></textarea>
                <label className={labelBase}>Bio</label>
              </div>
              <div className="flex justify-between">
                <button type="button" className="bg-gray/40 text-white py-2 px-4 rounded" onClick={prevStep}>Back</button>
                <button type="button" className="bg-teal/60 text-white py-2 px-4 rounded" onClick={nextStep}>Next</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4 text-white">
              <h2 className="text-xl font-bold text-gold">Security & Profile</h2>
              <div className="relative w-full mb-4 group">
                <input type="password" name="password" onChange={handleChange} className={inputBase} required placeholder=" " />
                <label className={labelBase}>Password</label>
              </div>
              <div className="text-sm space-y-1 grid grid-cols-2">
                <p className={`${passwordRules.length ? "text-gold" : "text-white"}`}>• At least 8 characters</p>
                <p className={`${passwordRules.uppercase ? "text-gold" : "text-white"}`}>• Must contain uppercase letter</p>
                <p className={`${passwordRules.number ? "text-gold" : "text-white"}`}>• Must contain a number</p>
                <p className={`${passwordRules.special ? "text-gold" : "text-white"}`}>• Must contain a special character</p>
              </div>

              <div>
                <input type="file" onChange={handleProfileUpload} className="w-full p-2 border rounded text-gold" accept="image/*" />
                {uploading && <p className="text-blue-600 text-sm">Uploading...</p>}
                {profileUrl && <img src={profileUrl} alt="Profile" className="w-20 h-20 rounded-full mt-2 object-cover" />}
              </div>

              <div className="flex justify-between">
                <button type="button" className="bg-gray/40 text-white py-2 px-4 rounded" onClick={prevStep}>Back</button>
                <button type="submit" className="bg-teal/60 text-white py-2 px-4 rounded" disabled={
                  !(passwordRules.length && passwordRules.uppercase && passwordRules.number && passwordRules.special && profileUrl) || registering
                }>
                  {registering ? "Registering..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProviderRegister;
