const router = require("express").Router();
const request = require("request");
const fs = require("fs");

const File = require("../models/File");
const Folder = require("../models/Folder");


// Create new file
router.post("/file", async (req, res) => {
    try {
        const newFile = await File.create({
            fileName: req.body.fileName,
            size: req.body.size,
            format: req.body.format
        });

        // Add to parent folder, if parent exists
        if (req.body._parent) {
            let parentFolder = await Folder.findByIdAndUpdate(req.body._parent, { $addToSet: { files: newFile._id } }, { new: true });

            // Add all folders from root to nearest parent to track them
            newFile.path = [...parentFolder.path, parentFolder._id];
            await newFile.save();
        }
        res.status(200).json(newFile);
    } catch (error) {
        res.status(500).json({ message: "Error while creating a new file", error });
    }
});

// Store a github file details using API
router.post("/github/info", (req, res) => {
    request({
        uri: "https://api.github.com/users/mralexgray/repos",
        method: "GET",
        headers: { 'user-agent': "node.js" }
    }, (error, response, body) => {
        if (error)
            res.status(500).json({ message: "Error while getting Github info", error: error.toString() });
        else {

            // Write it to a file
            fs.writeFileSync("./public/mralexgray.json", body);

            // Get statistics
            fs.stat("./public/mralexgray.json", async (error, stats) => {
                if (error)
                    res.status(500).json(error);
                else {
                    const newJSON = await File.create({
                        fileName: "mralexgray",
                        format: "json",
                        size: stats.size
                    });

                    res.status(200).json(newJSON);
                }
            });
        }
    });
});

// Copy-paste a file from one folder to another
router.patch("/change/file/location", async (req, res) => {
    try {

        // Remove it from current parent folder
        let currFolder = await Folder.findByIdAndUpdate(req.body.fromFolderId, { $pull: { files: req.body.fileId } });

        // Add it to the destination folder
        let destFolder = await Folder.findByIdAndUpdate(req.body.toFolderId, { $addToSet: { files: req.body.fileId } });

        // Update path of file to destination folder
        let updatedFile = await File.findByIdAndUpdate(
            req.body.fileId,
            { $set: { path: [...destFolder.path, destFolder._id] } },
            { new: true }
        );

        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(500).json({ message: "Changing location failed", error });
    }
});

// Search a file with name od format
router.get("/search/file", (req, res) => {
    File.findOne({ $or: [{ fileName: req.query.fileName }, { format: req.query.format }] })
        .populate({ path: "path", select: "folderName -_id" })
        .lean()
        .exec((error, file) => {
            if (error)
                res.status(500).json({ message: "Error while searching file", error });
            else {

                // Constructing path
                file.fullPath = file.path.reduce((pathStr, path) => pathStr + path.folderName + "/", "/") + file.fileName + "." + file.format;
                res.status(200).json(file);
            }
        });
});

// Get list of all files reverse sorted with date
router.get("/", (req, res) => {
    File.find({}).sort({ createdAt: -1 }).exec((error, files) => {
        if (error)
            res.status(500).json({ message: "Error while fetching files", error });
        else
            res.status(200).json(files);
    });
});

module.exports = router;