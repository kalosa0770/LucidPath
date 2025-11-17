const adminOnly = (req, res, next) => {
    if (!req.provider) return res.status(401).json({ success:false, message: "Not authorized" });
    if (req.provider.role !== "admin") return res.status(403).json({ success:false, message: "Admin only" });
    next();
  };
  
  export default adminOnly;
  