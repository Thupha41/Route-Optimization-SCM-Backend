"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor({ EM, DT = {} }) {
    super(EM);
    this.EC = -1; // Error Code
    this.EM = EM; // Error Message
    this.DT = DT; // Data
  }

  send(res) {
    return res.status(this.getStatusCode()).json(this);
  }

  getStatusCode() {
    return StatusCodes.INTERNAL_SERVER_ERROR; // Default status code is 500
  }
}

class BadRequestResponse extends ErrorResponse {
  constructor({ EM = ReasonPhrases.BAD_REQUEST, DT = {} }) {
    super({ EM, DT });
  }

  getStatusCode() {
    return StatusCodes.BAD_REQUEST; // Status code for bad requests is 400
  }
}

class UnauthorizedResponse extends ErrorResponse {
  constructor({ EM = ReasonPhrases.UNAUTHORIZED, DT = {} }) {
    super({ EM, DT });
  }

  getStatusCode() {
    return StatusCodes.UNAUTHORIZED; // Status code for unauthorized is 401
  }
}

class ForbiddenResponse extends ErrorResponse {
  constructor({ EM = ReasonPhrases.FORBIDDEN, DT = {} }) {
    super({ EM, DT });
  }

  getStatusCode() {
    return StatusCodes.FORBIDDEN; // Status code for forbidden is 403
  }
}

class NotFoundResponse extends ErrorResponse {
  constructor({ EM = ReasonPhrases.NOT_FOUND, DT = {} }) {
    super({ EM, DT });
  }

  getStatusCode() {
    return StatusCodes.NOT_FOUND; // Status code for not found is 404
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor({ EM = ReasonPhrases.CONFLICT, DT = {} }) {
    super({ EM, DT });
  }

  getStatusCode() {
    return StatusCodes.CONFLICT; // Status code for not found is 409
  }
}
module.exports = {
  ErrorResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictRequestError,
};
