import express from "express";
import {
  registerFirstSuperAdmin,
  loginSuperAdmin,
  getSuperAdminProfile,
  createSuperAdmin
} from "../controllers/superAdminController.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

// Public: Create the very first super admin if none exist
router.post("/bootstrap", registerFirstSuperAdmin);

// Super Admin: Login
router.post("/login", loginSuperAdmin);

// Protected: Get super admin profile
router.get("/me", superAdminAuth, getSuperAdminProfile);

// Protected: Create additional super admin
router.post("/create", superAdminAuth, createSuperAdmin);

export default router;
