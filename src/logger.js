// Consigna

// Basado en nuestro proyecto principal, implementar un logger

// Aspectos a incluir

// Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
// debug, http, info, warning, error, fatal
// Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola

// Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info.
// Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”
// Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
// Crear un endpoint /loggerTest que permita probar todos los logs

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
