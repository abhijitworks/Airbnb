const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/travelop";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./Utils/wrapAsync.js");
const { listingSchema } = require("./schema.js");

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
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Hi ");
});

//index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  allListings.forEach((listing) => {
    if (!listing.price) listing.price = 0;
  });
  console.log(allListings);
  res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new.ejs", async (req, res) => {
  res.render("listings/new");
});

//show route
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
});

//create route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    try {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    } catch (error) {
      res.json(error);
    }
  })
);

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listingData = { ...req.body.listing };

  // Ensure image is always an object with a url property
  if (listingData.image) {
    listingData.image = { url: listingData.image, filename: "listingimage" };
  }

  await Listing.findByIdAndUpdate(id, listingData);
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
});

app.listen(8080, () => {
  console.log("server is listening to post 8080");
});
