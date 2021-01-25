const { findOneLocationByUserId } = require('../repository/userLocation.repository');
const { searchNearbyPost } = require("../repository/postLocation.repository");
const { getSuggestionPostsWithPostId } = require("../repository/posts.repository");


async function findMealSuggestion(userId, locationDTO) {

    // if (preferenceIds.length === 0) {
    //   const preferences = await findAllUserPreferences(userId);
    //   preferenceIds = preferences.map((preference) => preference.id);
    // }

    if (!locationDTO) {
      locationDTO = await findOneLocationByUserId(userId);
    }

    // const preferences = await findAllPostPreferences(meatId);
      // const isPreferenceMatch = preferences
      //   .map((preference) => preference.id)
      //   .some((value) => preferenceIds.includes(value));
        // console.log(preferenceIds);
      // if (!isPreferenceMatch) {
      //   console.log(postId, " oops, preference not matched")
      //   continue;
      // }

    const posts = await searchNearbyPost(locationDTO);
    // console.log(posts.length," nearby posts");
    const matchedResult = [];
    for (let index = 0; index < posts.length; index++) {
      const { distanceInKm, postId } = posts[index];
      const postDetails = await getSuggestionPostsWithPostId(postId)

      matchedResult.push({
        ...postDetails,
        distanceInKm
      });
    }
    return matchedResult;
}


module.exports = {
    findMealSuggestion
}