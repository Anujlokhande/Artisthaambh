const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.routes");
const artistRoute = require("./routes/artist.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoose = require("mongoose");

function main() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

main();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listning On Port", process.env.PORT);
});

app.get("/", (req, res) => {
  res.send("Welcome To Artisthaan");
});

app.use("/user", userRoute);
app.use("/artist", artistRoute);
