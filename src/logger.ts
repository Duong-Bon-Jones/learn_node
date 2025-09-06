import EventEmitter from "events";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, simple, align, colorize } = format;

class Logger extends EventEmitter {
  log(message: string) {
    console.log(message);

    this.emit("messageLogged", {
      id: 1,
      message,
    });
  }
}

export { Logger };

export const winstonLogger = createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
//   winstonLogger.add(
//     new transports.Console({
//       format: combine(align(), colorize(), simple()),
//     })
//   );
// }
