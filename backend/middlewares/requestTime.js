const requestTime = (req, res, next) => {
  req.requestTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.requestTime;
    console.log(`[TIMING] ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};

module.exports = requestTime;
