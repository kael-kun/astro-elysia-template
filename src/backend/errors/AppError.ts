export const ErrorCodes = {
  UNAUTHORIZED: 1001,
  INVALID_CREDENTIALS: 1002,
  TOKEN_EXPIRED: 1003,
  TOKEN_INVALID: 1004,
  SESSION_NOT_FOUND: 1005,
  FORBIDDEN: 1006,
  NOT_FOUND: 1007,
  CONFLICT: 1008,
  EMAIL_EXISTS: 1009,
  BAD_REQUEST: 1010,
  UNPROCESSABLE: 1011,
  TOO_MANY_REQUESTS: 1012,
  INTERNAL_SERVER_ERROR: 1013,
  VALIDATION_ERROR: 1014,
} as const;

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: number,
    message: string,
    public errorName: string,
  ) {
    super(message);
  }
}

export const unauthorized = (message = "Unauthorized") =>
  new AppError(401, ErrorCodes.UNAUTHORIZED, message, "UNAUTHORIZED");

export const invalidCredentials = (message = "Invalid email or password") =>
  new AppError(401, ErrorCodes.INVALID_CREDENTIALS, message, "INVALID_CREDENTIALS");

export const tokenExpired = (message = "Token expired") =>
  new AppError(401, ErrorCodes.TOKEN_EXPIRED, message, "TOKEN_EXPIRED");

export const tokenInvalid = (message = "Invalid token") =>
  new AppError(401, ErrorCodes.TOKEN_INVALID, message, "TOKEN_INVALID");

export const sessionNotFound = (message = "Session not found or revoked") =>
  new AppError(404, ErrorCodes.SESSION_NOT_FOUND, message, "SESSION_NOT_FOUND");

export const forbidden = (message = "Forbidden") => new AppError(403, ErrorCodes.FORBIDDEN, message, "FORBIDDEN");

export const notFound = (message = "Not found") => new AppError(404, ErrorCodes.NOT_FOUND, message, "NOT_FOUND");

export const conflict = (message = "Conflict") => new AppError(409, ErrorCodes.CONFLICT, message, "CONFLICT");

export const emailExists = (message = "Email already registered") =>
  new AppError(409, ErrorCodes.EMAIL_EXISTS, message, "EMAIL_EXISTS");

export const badRequest = (message = "Bad request") =>
  new AppError(400, ErrorCodes.BAD_REQUEST, message, "BAD_REQUEST");

export const unprocessable = (message = "Unprocessable entity") =>
  new AppError(422, ErrorCodes.UNPROCESSABLE, message, "UNPROCESSABLE");

export const tooManyRequests = (message = "Too many requests") =>
  new AppError(429, ErrorCodes.TOO_MANY_REQUESTS, message, "TOO_MANY_REQUESTS");

export const internalServerError = (message = "Internal server error") =>
  new AppError(500, ErrorCodes.INTERNAL_SERVER_ERROR, message, "INTERNAL_SERVER_ERROR");
