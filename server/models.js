// Register all models
require("./models/File");
require("./models/Folder");

const mongoose = require("mongoose");


// DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/practice", (error) => {
    if (!error)
        console.log("DB Connected!");
});