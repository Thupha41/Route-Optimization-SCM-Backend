"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({ EC, EM, DT }) {
    this.EC = EC; // Error Code
    this.EM = EM; // Error Message
    this.DT = DT; // Data
  }

  send(res) {
    return res.status(this.getStatusCode()).json(this);
  }

  getStatusCode() {
    // Default to OK if not overridden
    return StatusCodes.OK;
  }
}

class OK extends SuccessResponse {
  constructor({ EM = ReasonPhrases.OK, DT = {} }) {
    super({ EC: 1, EM, DT });
  }

  getStatusCode() {
    return StatusCodes.OK; // 200
  }
}

class CREATED extends SuccessResponse {
  constructor({ EM = ReasonPhrases.CREATED, DT = {} }) {
    super({ EC: 1, EM, DT });
  }

  getStatusCode() {
    return StatusCodes.CREATED;
  }
}

class NO_CONTENT extends SuccessResponse {
  constructor({ EM = ReasonPhrases.NO_CONTENT }) {
    super({ EC: 1, EM, DT: null });
  }

  getStatusCode() {
    return StatusCodes.NO_CONTENT;
  }
}

module.exports = {
  OK,
  CREATED,
  NO_CONTENT,
};
