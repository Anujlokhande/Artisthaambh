const mongoose = require("mongoose");
const data = require("./sample.js");
const Listing = require("../models/listing.model.js");
async function main() {
  await mongoose.connect(`${process.env.DB_URL}`);
}

main()
  .then(() => {
    console.log("Working");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany();
  await Listing.insertMany(data.data);
  console.log("Data Was Initialized");
};

initDB();
