const {
  findAllMeatPreferences,
} = require("../repository/meatPreferences.repostitory");

/**
 * 
 * @returns an array of preference.entity.js
 */
async function getAllMeatPreferenceService(meatId) {
  return await findAllMeatPreferences(meatId);
}

module.exports = {
  getAllMeatPreferenceService,
};
