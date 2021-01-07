const {
    createMeatUser,
    findAllMeatUserByMeatId
} = require("../repository/meatUsers.repostitory");
const MeatUserRole = require("../enums/meatUserRole.enum");

async function createMeatOrganiserService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.ORGANISER)
}

async function createMeatParticipantService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.PARTICIPANT)
}

async function getMeatAnalyticsService(meatId = 0, userId = 0) {
    const allMeatUsers = await findAllMeatUserByMeatId(meatId);
    return {
        totalParticipants: allMeatUsers.length,
        isParticipated: allMeatUsers.includes(userId)
    }
}

module.exports = {
    createMeatOrganiserService,
    createMeatParticipantService,
    getMeatAnalyticsService
};
