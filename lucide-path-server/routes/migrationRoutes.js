import express from "express";
import Provider from "../models/providerModel.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

// Debug: Get all providers with their image fields (for debugging only)
router.get("/debug/providers-image-fields", async (req, res) => {
  try {
    const providers = await Provider.find({})
      .select('firstName lastName profileImageUrl')
      .lean();
    
    res.json({ 
      success: true, 
      count: providers.length,
      data: providers 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Migration: For super admin only - move old 'profile' field to 'profileImageUrl' for all providers that have it
router.post("/migrate/profile-field", superAdminAuth, async (req, res) => {
  try {
    // Find all documents where profile field exists but profileImageUrl doesn't, or vice versa
    const result = await Provider.updateMany(
      {
        $and: [
          { profile: { $exists: true, $ne: "" } },
          { $or: [
              { profileImageUrl: { $exists: false } },
              { profileImageUrl: "" }
            ]
          }
        ]
      },
      [
        {
          $set: {
            profileImageUrl: { $cond: [{ $gt: ["$profile", ""] }, "$profile", "$profileImageUrl"] }
          }
        }
      ]
    );

    res.json({ 
      success: true, 
      message: `Migrated ${result.modifiedCount} providers`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
