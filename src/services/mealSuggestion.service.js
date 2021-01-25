const { findAllUserPreferences } = require('../repository/userPreferences.repository');
const { findOneLocationByUserId } = require('../repository/userLocation.repostitory');


async function findMealSuggestion(userId, preferenceIds, locationDTO) {
    // if (preferenceIds.length === 0) {
    //   const preferences = await findAllUserPreferences(userId);
    //   preferenceIds = preferences.map((preference) => preference.id);
    // }

    if (!locationDTO) {
      locationDTO = await findOneLocationByUserId(userId);
    }
    
    const meats = await searchNearbyMeat(locationDTO);
    // console.log(meats.map(el => el.meatId));
    console.log(meats.length," nearby meats");
    const matchedResult = [];
    for (let index = 0; index < meats.length; index++) {
      const { distanceInKm, meatId } = meats[index];
      const preferences = await findAllMeatPreferences(meatId);
      const isPreferenceMatch = preferences
        .map((preference) => preference.id)
        .some((value) => preferenceIds.includes(value));
        // console.log(preferenceIds);
      if (!isPreferenceMatch) {
        console.log(meatId, " oops, preference not matched")
        continue;
      }
      const meat = await findOneMeat(meatId);
      const isOngoing = meat.status === MeatStatus.ONGOING;
      if (!isOngoing) {
        console.log(meatId, " oops, it's not ongoing")
        continue;
      }
      matchedResult.push({
        id: meat.id,
        imageUrl: storage.mediaLink,
        title: meat.title,
        description: meat.description,
        maxParticipant: meat.maxParticipant,
        startTime: meat.startTime,
        endTime: meat.endTime,
        status: meat.status,
        createdDate: meat.createdDate,
        lastModifiedDate: meat.lastModifiedDate,
        distanceInKm,
    });
    }
    return matchedResult;
}


module.exports = {
    findMealSuggestion
}