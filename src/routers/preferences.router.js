const express = require("express");
const router = express.Router();
const { handleError } = require("../utils/router.utils");
const { findAllPreferences } = require("../repository/preferences.repository")

router.get("/preferences", async (req, res) => {
  try {
    const result = await findAllPreferences();
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
