const {
  createMeatUser,
  updateMeatUserStatus,
  findAllMeatUserByMeatId,
  findAllMeatUserByUserIdAndStatus,
} = require("../repository/meatUsers.repository");
const MeatUserRole = require("../enums/meatUserRole.enum");
const MeatUserStatus = require("../enums/meatUserStatus.enum");

async function createMeatOrganiserService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.ORGANISER);
}

async function createMeatParticipantService(meatId, userId) {
  return await createMeatUser(meatId, userId, MeatUserRole.PARTICIPANT);
}

async function notComingMeatService(meatId, userId) {
  const mysqlResponse = await updateMeatUserStatus(
    meatId,
    userId,
    MeatUserStatus.NOT_COMING
  );
  if (mysqlResponse.affectedRows < 1) {
    throw new BadRequestException("no meat is updated. Is meat exist?");
  }
  return mysqlResponse;
}

/**
 *
 * @returns an array of meat_id(s)
 */
async function findGoingMeatsService(userId) {
  const meatUsers = await findAllMeatUserByUserIdAndStatus(
    userId,
    MeatUserStatus.GOING
  );
  return meatUsers.map((el) => el.meatId);
}

/**
 *
 * @returns an object containing totalParticipants and role
 * @var totalParticipants is the total count of ONGOING participants
 * @var role is either [organiser, participant, null - haven't join]
 * @var status is either [going, not_coming, null - haven't join]
 *
 */
async function getMeatAnalyticsService(meatId = 0, userId = 0) {
  const allMeatUsers = await findAllMeatUserByMeatId(meatId);
  const totalParticipants = allMeatUsers.filter(
    (el) => el.status === MeatUserStatus.GOING
  ).length;
  const foundMeatUser = allMeatUsers.find((el) => el.userId === userId);
  const role = foundMeatUser ? foundMeatUser.role : null;
  const status = foundMeatUser ? foundMeatUser.status : null;
  return {
    totalParticipants: totalParticipants,
    role: role,
    status: status,
  };
}

module.exports = {
  createMeatOrganiserService,
  createMeatParticipantService,
  notComingMeatService,
  findGoingMeatsService,
  getMeatAnalyticsService,
};
