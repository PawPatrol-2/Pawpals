export class AppError extends Error {
    statusCode: number
    isOperational: boolean
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    errors: string[]
    constructor(message = "Validation error", errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

export class UnauthorizedError extends AppError {
    errors: string[]
    constructor(message = "Authorization is required", errors = []) {
        super(message, 401);
        this.errors = errors;
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Access Denied") {
        super(message, 403)
    }
}

export class NotFoundError extends AppError {
    constructor(message = "The resource could not be located"){
        super(message, 404)
    }
}

export class ConflictError extends AppError {
    constructor(message = "The resource is already present") {
        super(message, 409)
    }
}

