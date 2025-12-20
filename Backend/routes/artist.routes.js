const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const artistController = require("../controllers/artist.controller");
const auth = require("../midelwares/auth");
const jwt = require("jsonwebtoken");
const artistModel = require("../models/artist.model");
const userModel = require("../models/user.model");
const listingModel = require("../models/listing.model");
const axios = require("axios");

const upload = require("../midelwares/multer.js");

router.post(
  "/register",
  [
    body("email").isEmail().isLength({ min: 5 }),
    body("password").isString().isLength({ min: 5 }),
    body("fullname.firstname").isString().isLength({ min: 3 }),
    body("city").isString().isLength({ min: 2 }),
  ],
  artistController.registerArtist
);

router.post(
  "/login",
  [
    body("email").isString().isLength({ min: 5 }).withMessage("Email Invalid"),
    body("password")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Password Invalid"),
  ],
  artistController.loginArtist
);

router.get("/logout", auth.authArtist, artistController.logoutArtist);
router.get("/getArtist", auth.authArtist, artistController.getArtist);

//Listing

router.post(
  "/create",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Email Listing Title"),
    body("description")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Email Listing Description"),
    body("image").isString().withMessage("Email Listing Image"),
    body("typeOfArt")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Invalid Art Type"),
    body("price").isString().withMessage("Price Is Invalid"),
  ],
  auth.authArtist,
  artistController.createListing
);

router.put("/update/:id", auth.authArtist, artistController.updateListing);

router.delete("/delete/:id", auth.authArtist, artistController.deleteListing);

router.get("/show", artistController.show);
router.get("/show/:id", artistController.showListing);

//who logged in

router.get("/loggedIn", artistController.LoggedIn);

router.get("/artOwner/:id", auth.authArtist, auth.artOwner);

router.post("/upload", upload.single("file"), artistController.uploadImage);

//map

router.get("/map/:id", artistController.map);

module.exports = router;
