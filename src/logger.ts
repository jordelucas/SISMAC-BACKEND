import pino from 'pino';
import PinoPretty = require('pino-pretty');

export default pino({
  enabled: true,
  level: 'info',
  prettyPrint: {
    levelFirst: true,
    colorize: true
  }
})

