import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads/providers");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  // accept images only
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"), false);
  cb(null, true);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB
