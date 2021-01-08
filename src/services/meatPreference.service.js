const {
  createMeatPreference,
  findAllMeatPreferences,
  deleteMeatPreference,
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
 * @example
 * existingPreferenceIds = [1,2]
 * newPreferenceIds = [2,3]
 * so needToDeletePreferenceIds = [1]
 * so needToAddPreferenceIds = [3]
 *
 */
async function updateMeatPreferencesService(meatId, newPreferenceIds = []) {
  const preferences = await getAllMeatPreferenceService(meatId);
  const existingPreferenceIds = preferences.map((preference) => preference.id);
  const needToDeletePreferenceIds = existingPreferenceIds.filter(
    (preferenceId) => !newPreferenceIds.includes(preferenceId)
  );
  await deleteMeatPreferencesService(meatId, needToDeletePreferenceIds);
  const needToAddPreferenceIds = newPreferenceIds.filter(
    (preferenceId) => !existingPreferenceIds.includes(preferenceId)
  );
  return await createMeatPreferencesService(meatId, needToAddPreferenceIds);
}

async function deleteMeatPreferencesService(meatId, preferenceIds = []) {
  return await Promise.all(
    preferenceIds.map((preferenceId) =>
      deleteMeatPreference(meatId, preferenceId)
    )
  );
}

/**
 *
 * @returns an array of preference.entity.js, NOT meatPreference.entity.js
 */
async function getAllMeatPreferenceService(meatId) {
  return await findAllMeatPreferences(meatId);
}

module.exports = {
  createMeatPreferencesService,
  updateMeatPreferencesService,
  getAllMeatPreferenceService,
};
