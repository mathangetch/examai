const limiter = require('express-rate-limit');

const rateLimiter = limiter.rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, 
  handler: function (req, res) {
    return res.status(429).json({
      error: 'You sent too many requests. Please try again after 1 minute'
    })
  }
});



module.exports = rateLimiter;
