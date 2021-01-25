const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
    findMealSuggestion
} = require("../services/mealSuggestion.service")

router.get("/meal/suggest", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        //handle location
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);
        let locationDTO = null;
        if (!(isNaN(latitude) || isNaN(longitude))) {
            locationDTO = new LocationDTO(latitude, longitude);
        }
        const dataArr = await findMealSuggestion(userId, locationDTO);

        const posts = dataArr.map(el => {
            return {
                ...el,
                locationDTO: new LocationDTO(el.latitude, el.longitude, el.location_name, el.location_address)
            }
        });
        res.status(200).send(posts);
    } catch (err) {
        handleError(res, err);
    }
});


module.exports = router