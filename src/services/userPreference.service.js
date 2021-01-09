const {
  findAllUserPreferences,
} = require("../repository/userPreferences.repostitory");

async function findAllUserPreferencesService(userId) {
  return await findAllUserPreferences(userId);
}

module.exports = {
  findAllUserPreferencesService,
};
