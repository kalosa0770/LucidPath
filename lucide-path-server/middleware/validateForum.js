// Basic validation helpers for forum routes
const requireFields = (fields = []) => (req, res, next) => {
  const missing = [];
  fields.forEach((f) => {
    if (req.body == null || req.body[f] === undefined || req.body[f] === null || String(req.body[f]).trim() === '') missing.push(f);
  });
  if (missing.length) return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  next();
};

const validateModerationAction = (req, res, next) => {
  const { action } = req.body || {};
  const allowed = ['delete', 'restore', 'archive', 'pin', 'unpin'];
  if (!action || !allowed.includes(action)) return res.status(400).json({ success: false, message: 'Invalid moderation action' });
  next();
};

export { requireFields, validateModerationAction };
