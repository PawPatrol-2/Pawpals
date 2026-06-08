import pino from 'pino'

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
            paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.headers.user-agent',
                'req.headers.referer',
                'req.headers.origin',
                'req.remoteAddress',
                'req.remotePort',
                'req.params.id',
                'req.body.password',
                'req.body.token',
                'req.body.email',
                'req.body.username',
                'req.body.fullname',
                'req.body.motivation',
                'req.body.allergyDetails',
                'password',
                'passwordHash',
                'email',
                'username',
                'fullname',
                'motivation',
                'allergyDetails',
                'userId',
                '*.password',
                '*.passwordHash',
                '*.email',
                '*.username',
                '*.fullname',
                '*.motivation',
                '*.allergyDetails',
                '*.userId'
            ],
            censor: '[REDACTED]',
    }
})

export default logger
