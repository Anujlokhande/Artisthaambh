const userModel = require("../models/user.model");
const artistModel = require("../models/artist.model");
const ListingModel = require("../models/listing.model");
const jwt = require("jsonwebtoken");
const express = require("express");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authArtist = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Token Is Not Available " });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const artist = await artistModel.findById(decoded._id).populate("arts");
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    req.artist = artist;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized 1" });
  }
};

// module.exports.loggedIn = async (req, res) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     // console.log(token);

//     if (!token) {
//       return res.status(400).json({ message: "Token Is Not Present" });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const artist = await artistModel.findById(decoded._id);
//     if (artist) {
//       return res.status(200).json({ role: "artist", artist });
//     }

//     const user = await userModel.findById(decoded._id);
//     if (user) {
//       return res.status(200).json({ role: "user", user });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//checking the owner of art

module.exports.artOwner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const listing = await ListingModel.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.owner.toString() === req.artist._id.toString();

    // Always 200, frontend decides UI
    return res.status(200).json({ authorized: isOwner });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
