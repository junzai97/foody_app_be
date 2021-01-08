const {
  createMeatPreference,
  findAllMeatPreferences,
} = require("../repository/meatPreferences.repostitory");

async function createMeatPreferencesService(meatId, preferenceIds = []) {
  return await Promise.all(
    preferenceIds.map((preferenceId) =>
      createMeatPreference(meatId, preferenceId)
    )
  );
}

/**
 *
 * @returns an array of preference.entity.js
 */
async function getAllMeatPreferenceService(meatId) {
  return await findAllMeatPreferences(meatId);
}

module.exports = {
  createMeatPreferencesService,
  getAllMeatPreferenceService,
};
