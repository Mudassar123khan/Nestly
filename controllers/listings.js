const Listing = require("../models/listing");

module.exports.index=async (req, res) => {
    let listings = await Listing.find();
    console.log("request to all the listings is received");
    res.render("listings/index.ejs", { listings });
  }

module.exports.renderNewForm= (req, res) => {
  console.log("request to create new listinng is received");
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let details = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!details) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    console.log(`Request to show listing is received with id ${id}`);
    res.render("listings/show.ejs", { details });
  }

  module.exports.createListing = async (req, res) => {
    console.log("Request to post the data to DB is received");

    let { title, description, price, url, location, country } = req.body;
    const listingData = {
      title,
      description,
      image: {
        url: url,
      },
      price,
      location,
      country,
    };
    listingData.owner = req.user._id;
    console.log(listingData.owner);
    await Listing.create(listingData);
    req.flash("success", "New listing added");
    res.redirect("/listings");
  }

  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      let obj = await Listing.findById(id);
      if (!obj) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
      }
      console.log("Request to edit is received");
      res.render("listings/edit.ejs", { obj });
    }

    module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, url, location, country } = req.body;
    if (!title || !description || !price || !url || !location || !country) {
      throw new ExpressError(
        400,
        "All the fields are required!! Please send data"
      );
    }
    let listing = Listing.findById(id);

    let owner = listing.owner;
    let updatedListing = {
      title: title,
      description: description,
      image: {
        url: url,
      },
      price: price,
      location: location,
      country: country,
      owner: owner,
    };

    await Listing.findByIdAndUpdate(id, { ...updatedListing });
    console.log("edits saved");
    req.flash("success", "Listing Updated");
    res.redirect(`/listings`);
  }

  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Request to delete a listing is received");
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  }