const express = require("express");
const router = express.Router();
const { hasMissingKey } = require("../utils/compare.utils");
const { handleError } = require("../utils/router.utils");
const MeatDTO = require("../dtos/meatDTO.dto");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  createMeatService,
  updateMeatService,
  cancelMeatService,
  findOneMeatService,
} = require("../services/meat.service");
const BadRequestException = require("../exceptions/badRequestException.exception");
const {
  createMeatParticipantService,
  notComingMeatService,
} = require("../services/meatUser.service");

router.post("/meat", async (req, res) => {
  try {
    const meatDTO = req.body;
    const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), ["id"]);
    const isInvalidLocationDTO = hasMissingKey(
      meatDTO.locationDTO,
      new LocationDTO()
    );
    if (isInvalidMeatDTO || isInvalidLocationDTO) {
      throw new BadRequestException("invalid request body");
    }
    const savedResult = await createMeatService(meatDTO);
    res
      .status(201)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/meat/:meatId/join", async (req, res) => {
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

router.put("/meat/:meatId/unjoin", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const userId = 1;
    const mysqlResponse = await notComingMeatService(meatId, userId);
    res.status(200).send(mysqlResponse);
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/meat", async (req, res) => {
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

router.put("/meat/:meatId/cancel", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const mysqlResponse = await cancelMeatService(meatId);
    res.status(200).send(mysqlResponse);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/meat/:meatId", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const result = await findOneMeatService(meatId);
    res.status(200).send(result);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
