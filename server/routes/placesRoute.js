const express = require("express");
const router = express.Router();
const { placesAutocomplete } = require("../controllers/placesController");

router.get("/places-autocomplete", placesAutocomplete);

module.exports = router;
