const express = require("express");
const router = express.Router();
const { hasMissingKey } = require("../utils/compare.utils");
const {
  createMeatLocation,
  updateMeatLocation,
} = require("../services/firestore.service");
const MeatDTO = require("../dtos/meatDTO.dto");
const LocationDTO = require("../dtos/locationDTO.dto");
const { createMeatService, updateMeatService, cancelMeatService, findOneMeatService } = require("../services/meat.service");

router.post("/meat", async (req, res) => {
  const meatDTO = req.body;
  const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), ["id"]);
  const isInvalidLocationDTO = hasMissingKey(
    meatDTO.locationDTO,
    new LocationDTO()
  );
  if (isInvalidMeatDTO || isInvalidLocationDTO) {
    res.status(400).send("invalid request body");
    return;
  }
  try {
    const savedResult = await createMeatService(meatDTO);
    const firestoreData = await createMeatLocation(
      savedResult.insertId,
      meatDTO.locationDTO
    );
    res
      .status(201)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/meat", async (req, res) => {
  const meatDTO = req.body;
  const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), [
    "base64String",
  ]);
  const isInvalidLocationDTO = hasMissingKey(
    meatDTO.locationDTO,
    new LocationDTO()
  );
  if (isInvalidMeatDTO || isInvalidLocationDTO) {
    res.status(400).send("invalid request body");
    return;
  }
  try {
    const mysqlResponse = await updateMeatService(meatDTO);
    if (mysqlResponse.affectedRows < 1) {
      res.status(400).send("no meat is updated. Is meat exist?");
      return;
    }
    const updatedFirestoreData = await updateMeatLocation(
      meatDTO.id,
      meatDTO.locationDTO
    );
    res.status(200).send(mysqlResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/meat/:meatId/cancel", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const mysqlResponse = await cancelMeatService(meatId);
    if (mysqlResponse.affectedRows < 1) {
      res.status(400).send("no meat is cancelled. Is meat exist?");
      return;
    }
    res.status(200).send(mysqlResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/meat/:meatId", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const result = await findOneMeatService(meatId)
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
