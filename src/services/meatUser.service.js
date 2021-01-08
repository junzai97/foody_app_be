const {
  createMeatUser,
  updateMeatUserStatus,
  findAllMeatUserByMeatId,
} = require("../repository/meatUsers.repostitory");
const MeatUserRole = require("../enums/meatUserRole.enum");
const MeatUserStatus = require("../enums/meatUserStatus.enum");

async function createMeatOrganiserService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.ORGANISER);
}

async function createMeatParticipantService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.PARTICIPANT);
}

async function notComingMeatService(meatId, userId) {
   const mysqlResponse = await updateMeatUserStatus(meatId, userId, MeatUserStatus.NOT_COMING);
   if (mysqlResponse.affectedRows < 1) {
     throw new BadRequestException("no meat is updated. Is meat exist?");
   }
   return mysqlResponse;
}

/**
 *
 * @returns an object containing totalParticipants and role
 * @var totalParticipants is the total count of ONGOING participants
 * @var role is either [organiser, participant, null - haven't join]
 *
 */
async function getMeatAnalyticsService(meatId = 0, userId = 0) {
  const allMeatUsers = await findAllMeatUserByMeatId(meatId);
  const totalParticipants = allMeatUsers.filter(
    (el) => el.status === MeatUserStatus.GOING
  ).length;
  const foundMeatUser = allMeatUsers.find((el) => el.userId === userId);
  const role = foundMeatUser ? foundMeatUser.role : null;
  return {
    totalParticipants: totalParticipants,
    role: role,
  };
}

module.exports = {
  createMeatOrganiserService,
  createMeatParticipantService,
  notComingMeatService,
  getMeatAnalyticsService,
};
