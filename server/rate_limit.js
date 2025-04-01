const ratelimit = require('express-rate-limit');
const logger = require('./server_logger');
const limiter=ratelimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
    handler: (req, res) => {
        logger.alert("Too many request", { ip: req.ip });
        res.status(429).send("Too many requests, please try again later.");
    },
});

module.exports = limiter;