import jwt from "jsonwebtoken";
import Provider from "../models/providerModel.js";

const auth = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers?.authorization;
    const token = tokenFromCookie || (authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) return res.status(401).json({ success:false, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const provider = await Provider.findById(decoded.id).select("-password");
    if (!provider) return res.status(401).json({ success:false, message: "Not authorized" });

    req.provider = provider; // attach user
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message: "Invalid token" });
  }
};

export default auth;
