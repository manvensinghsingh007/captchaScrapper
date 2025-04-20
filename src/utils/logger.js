const winston = require("winston");
const path = require("path");
const { getLogFileName } = require("../utils/utils");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        `../../Logs/${getLogFileName("scrapping")}`
      ),
    }),
  ],
});

module.exports = logger;
