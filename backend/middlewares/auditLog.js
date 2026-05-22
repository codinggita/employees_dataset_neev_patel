const auditLog = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const user = req.user ? req.user.id || req.user.email : 'anonymous';
  const method = req.method;
  const url = req.originalUrl;
  const body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? JSON.stringify(req.body) : 'N/A';

  console.log(`[AUDIT] ${timestamp} | User: ${user} | ${method} ${url} | Body: ${body}`);

  next();
};

module.exports = auditLog;
