const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { hasMissingKey } = require("../utils/compare.utils");
const { handleError } = require("../utils/router.utils");
const MeatDTO = require("../dtos/meatDTO.dto");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  createMeatService,
  updateMeatService,
  cancelMeatService,
  findUpcomingMeats,
  findOneMeatService,
} = require("../services/meat.service");
const BadRequestException = require("../exceptions/badRequestException.exception");
const {
  createMeatParticipantService,
  notComingMeatService,
} = require("../services/meatUser.service");

router.post("/meat", auth, async (req, res) => {
  try {
    const userId = req.user.id
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
    res
      .status(201)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/meat/:meatId/join", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = 1;
    const savedResult = await createMeatParticipantService(meatId, userId);
    res
      .status(201)
      .send(`MeatUser with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat/:meatId/unjoin", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = 1;
    const mysqlResponse = await notComingMeatService(meatId, userId);
    res.status(200).send(mysqlResponse);
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
    res.status(200).send(mysqlResponse);
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat/:meatId/cancel", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const mysqlResponse = await cancelMeatService(meatId);
    res.status(200).send(mysqlResponse);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/upcoming", auth, async (req, res) => {
  try {
    const userId = 1;
    const result = await findUpcomingMeats(userId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/:meatId", auth, async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const result = await findOneMeatService(meatId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
