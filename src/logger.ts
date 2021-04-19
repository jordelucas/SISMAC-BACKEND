import pino from 'pino';

export default pino({
  enabled: true,
  level: 'info',
  prettyPrint: {
    levelFirst: true,
    colorize: true
  },
}, pino.destination("pino-logger.log"))