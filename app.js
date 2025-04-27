const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/travelop";
const Listing = require("./models/listing.js");

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
app.get("/", (req, res) => {
  res.send("Hi ");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My home",
    desc: "New home",
    price: 1200,
    location: "Goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("Success");
  res.send("Success");
});

app.listen(8080, () => {
  console.log("server is listening to post 8080");
});
