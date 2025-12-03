import express from "express";
import upload from "../config/multer.js";
import {
  registerProvider, loginProvider, getProviderProfile,
  listProviders, approveProvider, rejectProvider, updateProfile,
  sendMessageToUser, getDashboardStats, getRecentClients, getMoodTrends, getRiskAlerts,
  getTodayAppointments, getRecentMessages, getPendingProviders,
  listAvailableTherapists, getTherapistProfile, bookAppointment
} from "../controllers/providerController.js";
// import { upload } from "../utils/multerConfig.js";
import auth from "../middleware/providerAuth.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

// Public
router.post("/register", registerProvider);
router.post("/login", loginProvider);

// Protected
router.get("/me", auth, getProviderProfile);
router.put("/me", auth, upload.single("profile"), updateProfile);

// provider -> user messaging (requires providerAuth)
router.post('/message/:userId', auth, sendMessageToUser);

// Dashboard data endpoints (provider)
router.get('/dashboard/stats', auth, getDashboardStats);
router.get('/dashboard/clients', auth, getRecentClients);
router.get('/dashboard/mood-trends', auth, getMoodTrends);
router.get('/dashboard/risk-alerts', auth, getRiskAlerts);
router.get('/dashboard/appointments', auth, getTodayAppointments);
router.get('/dashboard/messages', auth, getRecentMessages);

// Super Admin: Provider management (list, approve, reject)
router.get("/", superAdminAuth, listProviders); // ?status=pending
router.get("/pending", superAdminAuth, getPendingProviders);
router.post("/approve/:id", superAdminAuth, approveProvider);
router.post("/reject/:id", superAdminAuth, rejectProvider);

export default router;
