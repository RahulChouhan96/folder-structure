// DB connection & registering all models
require("./server/models");

const express = require("express");
const bodyParser = require("body-parser");

const fileRoutes = require("./server/routes/files");
const folderRoutes = require("./server/routes/folders");

const app = express();

// Parse request body
app.use(bodyParser.json());

app.use("/files", fileRoutes);
app.use("/folders", folderRoutes);

app.listen("4900", () => console.log("Server running at 4900!"));