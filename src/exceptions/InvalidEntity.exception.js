class InvalidEntity extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
  }
}


module.exports = {
    InvalidEntity,
};