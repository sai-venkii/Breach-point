const { createLogger, transports, format, config } = require("winston");
const { combine, timestamp, json } = format;

const teamsLogger = createLogger({
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
    new transports.File({ filename: "logs/round1_user.log" }),
  ],
});

module.exports = teamsLogger;
