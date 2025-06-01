"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenRequestException = exports.NotFoundException = exports.ServiceUnavailableException = exports.ExpectationFailedException = exports.InternalServerErrorException = exports.UnauthorizedException = exports.ValidationException = exports.BadRequestException = exports.ServiceException = void 0;
class ServiceException extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
exports.ServiceException = ServiceException;
class BadRequestException extends ServiceException {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class ValidationException extends ServiceException {
    constructor(details) {
        super('Validation Failed', 422);
        this.details = details.reduce((acc, { field, message }) => {
            // acc[field] = `"${field}" ${message}`;
            return acc;
        }, {});
    }
}
exports.ValidationException = ValidationException;
class UnauthorizedException extends ServiceException {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class InternalServerErrorException extends ServiceException {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class ExpectationFailedException extends ServiceException {
    constructor(message) {
        super(message, 417);
    }
}
exports.ExpectationFailedException = ExpectationFailedException;
class ServiceUnavailableException extends ServiceException {
    constructor(message) {
        super(message, 503);
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class NotFoundException extends ServiceException {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenRequestException extends ServiceException {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'You are not authorized to perform this action', 403);
    }
}
exports.ForbiddenRequestException = ForbiddenRequestException;
//# sourceMappingURL=service-exception.js.map