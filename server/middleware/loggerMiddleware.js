// middlewares/logger.middleware.js
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // 1000ms এর বেশি হলে warn করো
    if (duration > 1000) {
      console.warn(`SLOW REQUEST: ${req.method} ${req.url} — ${duration}ms`);
    } else {
      console.log(`${req.method} ${req.url} — ${duration}ms`);
    }
  });

  next();
};

export default requestLogger;
