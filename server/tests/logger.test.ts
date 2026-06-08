import pino from 'pino';
import { Writable } from 'stream';

function createTestLogger() {
    const lines: string[] = [];
    const stream = new Writable({
        write(chunk, _encoding, callback) {
            lines.push(chunk.toString());
            callback();
        },
    });
    const logger = pino(
        {
            level: 'info',
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    'req.body.token',
                    '*.password',
                    '*.passwordHash',
                ],
                censor: '[REDACTED]',
            },
        },
        stream
    );
    return { logger, lines };
}

describe('logger redaction', () => {
    it('redacts req.headers.authorization', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ req: { headers: { authorization: 'Bearer secret-token' } } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.req.headers.authorization).toBe('[REDACTED]');
    });

    it('redacts req.headers.cookie', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ req: { headers: { cookie: 'session=abc123' } } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.req.headers.cookie).toBe('[REDACTED]');
    });

    it('redacts req.body.password', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ req: { body: { password: 'supersecret' } } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.req.body.password).toBe('[REDACTED]');
    });

    it('redacts req.body.token', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ req: { body: { token: 'my-reset-token' } } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.req.body.token).toBe('[REDACTED]');
    });

    it('redacts *.password with wildcard', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ user: { password: 'mysecret' } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.user.password).toBe('[REDACTED]');
    });

    it('redacts *.passwordHash with wildcard', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ user: { passwordHash: '$2b$10$hashedvalue' } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.user.passwordHash).toBe('[REDACTED]');
    });

    it('does not redact non-sensitive fields', () => {
        const { logger, lines } = createTestLogger();
        logger.info({ user: { email: 'test@example.com', name: 'Alice' } }, 'test');
        const output = JSON.parse(lines[0]);
        expect(output.user.email).toBe('test@example.com');
        expect(output.user.name).toBe('Alice');
    });
});
