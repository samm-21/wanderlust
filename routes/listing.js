const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))     //index route
    .get(wrapAsync(listingController.search))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));   //create route

router.get("/new", isLoggedIn, listingController.renderNewForm);     //new listing route

router.route("/:id")
    .get(wrapAsync(listingController.showListing))    //show route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));   //delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing));

module.exports = router;