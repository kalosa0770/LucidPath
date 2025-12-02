import express from "express";
import upload from "../config/multer.js";
import {
  registerProvider, loginProvider, getProviderProfile,
  listProviders, approveProvider, rejectProvider, updateProfile
} from "../controllers/providerController.js";
// import { upload } from "../utils/multerConfig.js";
import auth from "../middleware/providerAuth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

// Public
router.post("/register", registerProvider);
router.post("/login", loginProvider);

// Protected
router.get("/me", auth, getProviderProfile);
router.put("/me", auth, upload.single("profile"), updateProfile);

// provider -> user messaging (requires providerAuth)
import { sendMessageToUser } from '../controllers/providerController.js';
router.post('/message/:userId', auth, sendMessageToUser);

// Admin
router.get("/", auth, adminOnly, listProviders); // ?status=pending
router.post("/approve/:id", auth, adminOnly, approveProvider);
router.post("/reject/:id", auth, adminOnly, rejectProvider);

export default router;
