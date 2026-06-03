import pino from 'pino'

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
            paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.token',
                'password',
                'passwordHash',
                '*.password',
                '*.passwordHash'
            ],
            censor: '[REDACTED]',
    }
})

export default logger