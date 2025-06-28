// middleware/authorizeRole.js
module.exports = function(allowed = []) {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};