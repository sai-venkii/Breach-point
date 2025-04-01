const { createLogger, transports, format, config } = require("winston");
const { combine, timestamp, json } = format;
// emerg: number;
// alert: number;
// crit: number;
// error: number;
// warning: number;
// notice: number;
// info: number;
// debug: number;
const authLogger = createLogger({
  levels: config.syslog.levels,
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "logs/auth.log" }),
  ],
});

module.exports = authLogger;
