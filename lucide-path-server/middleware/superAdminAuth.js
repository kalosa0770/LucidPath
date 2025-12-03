import jwt from 'jsonwebtoken';
import SuperAdmin from '../models/superAdminModel.js';

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token_super_admin;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await SuperAdmin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Super admin not found' });
    }

    req.superAdmin = admin;
    next();
  } catch (err) {
    console.error('superAdminAuth error', err);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default superAdminAuth;
