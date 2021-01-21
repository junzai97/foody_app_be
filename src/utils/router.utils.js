const BadRequestException = require("../exceptions/badRequestException.exception");

function handleError(res, err) {
  console.log(err);
  if (err instanceof BadRequestException) {
    res.status(400).send(err);
  } else {
    res.status(500).send(err);
  }
}

module.exports = {
  handleError,
};
