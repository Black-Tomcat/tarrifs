import jsonStorage from "electron-json-storage";
import path from "path";

export default class Logger {
    static __rootLogger = null;

    static getLogger(name=null) {
        if (name === null) {
            if (Logger.__rootLogger === null) {
                Logger.__rootLogger = new Logger();
            }
            return Logger.__rootLogger
        } else {
            // TODO specify other loggers here
            return Logger.__rootLogger
        }
    }

    constructor(
        level = "DEBUG",
        levels = {
            "CRITICAL": 100,
            "FATAL": 100,
            "ERROR": 80,
            "WARNING": 60,
            "INFO": 40,
            "DEBUG": 20,
            "NOTSET": 0
        },
        transports = [
            (message, level) => {
                console.log("[" + new Date().toISOString() + "]", level + ":", message)
            },
            /* TODO (message, level) => {
                jsonStorage.setDataPath(path.resolve("./logs"));

                Storage.set("log", data, (err) => {
                    if (err) throw err;
                });
            }*/
        ]
    ) {
        this.level = level;
        this.levels = levels;

        this.transports = transports;

        for (const level in this.levels) {
            this[level.toLowerCase()] = (message) => {
                // if the authorized level is lower than the message, print it.
                if (this.levels[this.level] <= this.levels[level]) {
                    if (this.transports instanceof Array) {
                        for (const transport of this.transports) {
                            transport(message, level)
                        }
                    } else {
                        this.transports(message, level)
                    }
                }
            }
        }
    }
}
