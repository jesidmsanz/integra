const mongoose = require("mongoose");

let db = null;

module.exports = function setupDatabase(config) {
  if (!db) {
    mongoose.Promise = global.Promise;

    db = mongoose.createConnection(config, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db.on("connected", function () {
      console.log("Mongoose default connection is open");
    });

    db.on("error", function (err) {
      console.log("Mongoose default connection has occured " + err + " error");
    });

    db.on("disconnected", function () {
      console.log("Mongoose default connection is disconnected");
    });
  }

  return db;
};
