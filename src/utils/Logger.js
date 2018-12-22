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
            new ConsoleTransport(0),
            new FileTransport(60, "log")
        ]
    ) {
        this.level = level;
        this.levels = levels;

        this.transports = transports;

        for (const level in this.levels) {
            this[level.toLowerCase()] = (message, ...messageParts) => {
                // if the authorized level is lower than the message, print it.
                if (this.levels[this.level] <= this.levels[level]) {
                    if (this.transports instanceof Array) {
                        for (const transport of this.transports) {
                            transport.message(message, this.levels[level], level, messageParts)
                        }
                    } else {
                        this.transports.message(message, this.levels[level], level, messageParts)
                    }
                }
            }
        }
    }
}

class Transport {
    constructor(level) {
        this.level = level
    }

    message(level_num) {
        return this.level <= level_num;
    }
}

class ConsoleTransport extends Transport {
    constructor(
        level
    ) {
        super(level)
    }

    message(message, level_num, level_name, messageParts) {
        if (!super.message(level_num)) {
            return false
        }

        console.log("[" + new Date().toISOString().split("T")[1] + "]", level_name + ":", message, ...messageParts);
    }
}

class FileTransport extends Transport {
    constructor(
        level,
        file_handle
    ) {
        super(level);
        this.file_handle = file_handle;
        this.buffer = [];
        this.writing = false;
        jsonStorage.setDataPath(path.resolve("./logs"));

        jsonStorage.set(file_handle, {"log": []}, (error) => {
            if (error) throw error;
        })
    }

    message(message, level_num, level_name, messageParts) {
        if (!super.message(level_num)) {
            return false
        }

        this.buffer.push("[" + new Date().toISOString() + "] " + level_name + ": " + message);
        if (this.writing) return true;

        this.writing = true;
        jsonStorage.setDataPath(path.resolve("./logs"));

        jsonStorage.get(this.file_handle, this.writeBuffer);

        return true;
    }

    writeBuffer = (error, data) => {
        if (error) throw error;

        jsonStorage.set(
            this.file_handle,
            {
                log: [
                    ...data['log'],
                    ...this.buffer,
                ]
            },
            this.clearBuffer
        );
    };

    clearBuffer = (error) => {
        if (error) throw error;
        this.buffer = [];
        this.writing = false;

        if (this.buffer.length > 0) {
            jsonStorage.get(this.file_handle, this.writeBuffer);
        }
    }
}
