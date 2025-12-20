const artistModel = require("../models/artist.model");
const Listing = require("../models/listing.model");
const listingService = require("../services/listing.services");
const { validationResult } = require("express-validator");
const artistServices = require("../services/artist.services");
const cloudinary = require("../config/cloudinary.js");
const listingModel = require("../models/listing.model");
const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports.registerArtist = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const { email, password, fullname, phone, profilePic, city } = req.body;
    const isArtistExists = await artistModel.findOne({ email });
    if (isArtistExists) {
      return res.status(400).json({ message: "Artist Already Exists" });
    }

    const hashPassword = await artistModel.hashPassword(password);
    const artist = await artistServices.registerArtist({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
      phone,
      profilePic: profilePic || undefined,
      city,
    });
    req.artist = artist;

    const token = await artist.generateAuthToken();
    res.status(201).json({ artist, token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.loginArtist = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { email, password } = req.body;
  try {
    const artist = await artistModel
      .findOne({ email })
      .select("+password")
      .populate("arts");
    if (!artist) {
      return res
        .status(400)
        .json({ message: "Email Or Password Is Incorrect" });
    }

    const isMatched = await artist.comparePassword(password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ message: "Email Or Password Is Incorrect" });
    }

    const token = artist.generateAuthToken();
    req.artist = artist;

    res.cookie("token", token);
    res.status(200).json({ artist, token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.logoutArtist = async (req, res, next) => {
  if (req.headers.authorization) {
    req.headers.authorization = null;
  }
  res.clearCookie("token");
  res.status(200).json({ message: "Logged Out" });
};

module.exports.getArtist = async (req, res, next) => {
  res.status(200).json({ artist: req.artist });
};

//Listing

module.exports.createListing = async (req, res, next) => {
  if (!req.artist) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const { title, description, image, location, country, typeOfArt, price } =
      req.body;
    const listing = await listingService.createListing({
      title,
      description,
      image: image || undefined,
      location,
      country,
      owner: req.artist._id,
      typeOfArt,
      price,
    });

    listing.owner = req.artist._id;

    // req.artist.arts = listing._id;
    req.artist.arts.push(listing._id);
    await req.artist.save();
    res.status(200).json({ listing });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.updateListing = async (req, res, next) => {
  if (!req.artist) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.artist._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    const updates = req.body;
    // console.log(updates);

    const updatedListing = await listingService.updateListing(id, updates);

    res.status(200).json({ listing: updatedListing });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.deleteListing = async (req, res, next) => {
  if (!req.artist) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);

    if (req.artist._id.toString() != listing.owner.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this Listing" });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);
    res.status(200).json({ listing });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  const allListings = await Listing.find();
  res.status(200).json(allListings);
};

module.exports.showListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "owner",
        },
      });

    res.status(200).json(listing);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.LoggedIn = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token Is Not Present" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const artist = await artistModel.findById(decoded._id).populate("arts");
    if (artist) {
      return res.status(200).json({ role: "artist", artist });
    }

    const user = await userModel.findById(decoded._id).populate("saved");
    if (user) {
      return res.status(200).json({ role: "user", user });
    }

    return res.status(404).json({ message: "User or Artist not found" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "err" });
  }
};

//file upload

module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file" });
    }

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "my_uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

    const uploaded = await uploadFromBuffer(req.file.buffer);

    res.status(200).json({
      url: uploaded.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//map

module.exports.map = async (req, res) => {
  try {
    const listing = await listingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Combine location + country
    const locationQuery = `${listing.location}${
      listing.country ? ", " + listing.country : ""
    }`;

    const apiKey = process.env.GEOAPIFY_API_KEY;

    // GEOAPIFY GEOCODING
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      locationQuery
    )}&apiKey=${apiKey}`;

    const geocodeResponse = await axios.get(geocodeUrl);

    if (
      !geocodeResponse.data.features ||
      geocodeResponse.data.features.length === 0
    ) {
      return res.status(400).json({
        message: "Unable to fetch geocode data",
      });
    }

    const { lat, lon } = geocodeResponse.data.features[0].properties;

    // radius in meters
    const radius = 1000;

    // Geoapify static map with circle
    const staticMapUrl = `https://maps.geoapify.com/v1/staticmap
?style=osm-carto
&width=600
&height=300
&center=lonlat:${lon},${lat}
&zoom=14
&circle=lonlat:${lon},${lat};radius:${radius};fillcolor:%230066ff33;strokecolor:%230066ff
&marker=lonlat:${lon},${lat};color:%23ff0000
&apiKey=${apiKey}`;

    res.status(200).json({
      mapUrl: staticMapUrl,
      lat,
      lon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
