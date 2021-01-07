class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestException";
  }
}

module.exports = BadRequestException;
