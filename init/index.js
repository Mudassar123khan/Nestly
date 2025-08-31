const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/imperial_hotels");
}

//data initialisation function
const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68b0b2c2928876b6856c291f",
  }));

  await Listing.insertMany(initData.data);
  console.log("data initialised successfully");
};

initDB();
