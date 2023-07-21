import winston from 'winston'

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'cyan',
    info: 'yellow',
    http: 'green',
    debug: 'blue',
  },
}

winston.addColors(customLevels.colors)

export const prodLogger = (req, res, next) => {
  const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ],
  })
  prodLogger.http(`${req.method} ${req.url}`)
  req.logger = prodLogger
  next()
}

export const debugLogger = (req, res, next) => {
  const debugLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
    ],
  })
  debugLogger.http(`${req.method} ${req.url}`)
  req.logger = debugLogger
  next()
}

// module.exports = {
//   prodLoggerMiddleware,
//   debugLoggerMiddleware,
// }

// new winston.transports.File({ filename: '../files/errors.log' }),
