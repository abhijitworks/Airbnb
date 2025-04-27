const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/travelop";
const Listing = require("./models/listing.js");
const path = require("path");

main()
  .then(() => {
    console.log("connection succeed");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi ");
});

//index route
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//show route
app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});

app.listen(8080, () => {
  console.log("server is listening to post 8080");
});
