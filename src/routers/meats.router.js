const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { hasMissingKey } = require("../utils/compare.utils");
const { handleError } = require("../utils/router.utils");
const MeatDTO = require("../dtos/meatDTO.dto");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  createMeatService,
  updateMeatService,
  cancelMeatService,
  findExploreMeats,
  findUpcomingMeats,
  findOneMeatService,
} = require("../services/meat.service");
const BadRequestException = require("../exceptions/badRequestException.exception");
const {
  createMeatParticipantService,
  notComingMeatService,
} = require("../services/meatUser.service");
const {
  findAllMeatUsersByMeatIdAndMeatUserStatus,
} = require("../repository/meatUsers.repostitory");

router.post("/meat", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const meatDTO = req.body;
    const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), ["id"]);
    const isInvalidLocationDTO = hasMissingKey(
      meatDTO.locationDTO,
      new LocationDTO()
    );
    if (isInvalidMeatDTO || isInvalidLocationDTO) {
      throw new BadRequestException("invalid request body");
    }
    const savedResult = await createMeatService(meatDTO, userId);
    res.status(201).send({
      meatId: savedResult.insertId,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/meat/:meatId/join", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = req.user.id;
    const savedResult = await createMeatParticipantService(meatId, userId);
    res.status(201).send({
      meatId: meatId,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat/:meatId/unjoin", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = req.user.id;
    const mysqlResponse = await notComingMeatService(meatId, userId);
    res.status(200).send({
      meatId: meatId,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat", auth, async (req, res) => {
  try {
    const meatDTO = req.body;
    const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), [
      "base64String",
      "locationDTO",
    ]);
    if (isInvalidMeatDTO) {
      throw new BadRequestException("invalid request body");
    }
    const mysqlResponse = await updateMeatService(meatDTO);
    res.status(200).send({
      meatId: meatDTO.id,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat/:meatId/cancel", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const mysqlResponse = await cancelMeatService(meatId);
    res.status(200).send({
      meatId: meatId,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/explore", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // handle preference
    const preferenceId = req.query.perferenceId;
    let preferenceIds = [];
    if (Array.isArray(preferenceId)) {
      preferenceIds = preferenceId.map(el => parseInt(el));
    } else if (!isNaN(parseInt(preferenceId))) {
      preferenceIds = [parseInt(preferenceId)];
    }

    //handle location
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    let locationDTO = null;
    if (!(isNaN(latitude) || isNaN(longitude))) {
      locationDTO = new LocationDTO(latitude, longitude);
    }

    const result = await findExploreMeats(userId, preferenceIds, locationDTO);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/upcoming", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await findUpcomingMeats(userId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/:meatId", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = req.user.id;
    const result = await findOneMeatService(meatId, userId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/:meatId/meat-users", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = req.user.id;
    const result = await findAllMeatUsersByMeatIdAndMeatUserStatus(meatId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
