import Provider from "../models/providerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Register provider (multipart/form-data if file)
export const registerProvider = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      profession,
      title,
      experience,
      bio,
      profile, // now expects the Cloudinary URL
    } = req.body;

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "Profile photo required." });
    }

    const existing = await Provider.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = await Provider.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profession,
      title,
      experience,
      bio,
      profile: profile, // store Cloudinary URL
    });

    res.status(201).json({
      success: true,
      message: "Provider registered successfully!",
      provider: newProvider,
    });
  } catch (error) {
    console.error("RegisterProvider Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
  
};

// Provider login
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message: "Email and password required" });

    const provider = await Provider.findOne({ email });
    if (!provider) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, provider.password);
    if (!match) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const token = createToken(provider._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7*24*60*60*1000
    });

    // if account pending -> still allow login but return status? We will return provider data & status; frontend decides
    const safeProvider = await Provider.findById(provider._id).select("-password");

    res.json({ success:true, provider: safeProvider, token });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Get own provider data
export const getProviderProfile = async (req, res) => {
  try {
    const provider = req.provider;
    res.json({ success:true, provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: list providers (optionally filter)
export const listProviders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status; // e.g. ?status=pending
    const providers = await Provider.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success:true, providers });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: approve provider
export const approveProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ success:false, message: "Provider not found" });

    provider.status = "approved";
    await provider.save();

    // TODO: send approval email to provider (optional)

    res.json({ success:true, message: "Provider approved", provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: reject (optionally delete)
export const rejectProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ success:false, message: "Provider not found" });

    // mark as rejected (or delete)
    provider.status = "rejected";
    await provider.save();

    // optional: await Provider.findByIdAndDelete(id);

    res.json({ success:true, message: "Provider rejected", provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Update profile (provider)
// Update profile (provider)
// Update profile (provider)
// Update profile (provider)
export const updateProfile = async (req, res) => {
  try {
    const provider = req.provider;
    const updates = req.body || {};

    // if frontend sends a new profile URL, update it
    if (updates.profile) {
      provider.profile = updates.profile; // store Cloudinary URL
    }

    // only allow certain fields to be updated
    const allowed = [
      "firstName",
      "lastName",
      "phone",
      "profession",
      "title",
      "experience",
      "bio",
    ];

    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        provider[field] = updates[field];
      }
    });

    await provider.save();

    res.json({ success: true, provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


