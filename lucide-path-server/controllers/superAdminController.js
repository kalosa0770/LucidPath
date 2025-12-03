import SuperAdmin from "../models/superAdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Super Admin: Register the very first super admin (public, only if none exist)
export const registerFirstSuperAdmin = async (req, res) => {
  try {
    // Check if any super admin already exists
    const adminCount = await SuperAdmin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ success: false, message: 'Super admin account already exists' });
    }

    const { firstName, lastName, email, phone, password, title } = req.body || {};
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await SuperAdmin.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
      title: title || 'Super Admin',
      permissions: {
        canManageProviders: true,
        canManageUsers: true,
        canModerateForum: true,
      }
    });

    res.status(201).json({ success: true, message: 'First super admin created', admin: { _id: newAdmin._id, email: newAdmin.email } });
  } catch (err) {
    console.error('registerFirstSuperAdmin', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Super Admin: Login
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const admin = await SuperAdmin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(admin._id);
    res.cookie('token_super_admin', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      success: true, 
      message: 'Super admin logged in',
      admin: { _id: admin._id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, title: admin.title }
    });
  } catch (err) {
    console.error('loginSuperAdmin', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get super admin profile
export const getSuperAdminProfile = async (req, res) => {
  try {
    const admin = req.superAdmin; // set by middleware
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const profile = await SuperAdmin.findById(admin._id).select('-password');
    res.json({ success: true, superAdmin: profile });
  } catch (err) {
    console.error('getSuperAdminProfile', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create additional super admin (only by existing super admin)
export const createSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, title } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await SuperAdmin.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
      title: title || 'Super Admin',
      permissions: {
        canManageProviders: true,
        canManageUsers: true,
        canModerateForum: true,
      }
    });

    res.status(201).json({ success: true, message: 'Super admin created', admin: { _id: newAdmin._id, email: newAdmin.email } });
  } catch (err) {
    console.error('createSuperAdmin', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
