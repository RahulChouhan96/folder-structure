const router = require("express").Router();

const File = require("../models/File");
const Folder = require("../models/Folder");


// reate a folder
router.post("/folder", async (req, res) => {
    try {

        // Create new folder
        const newFolder = await Folder.create({ folderName: req.body.folderName });

        // If it is created inside another folder
        // Add it to parent folder
        // Also add the path
        if (req.body._parent) {
            let parentFolder = await Folder.findByIdAndUpdate(req.body._parent, { $addToSet: { folders: newFolder._id } }, { new: true });

            // Path will have IDs from root to nearest parent folder
            newFolder.path = [...parentFolder.path, parentFolder._id];
            await newFolder.save();
        }

        res.status(200).json(newFolder);
    } catch (error) {
        res.status(500).json({ message: "Error while creating a new folder", error });
    }
});

// Get folder size
router.get("/folder/size/:folderId", (req, res) => {

    // Size is coming from all files
    // Add size of all files which has this folder in their path
    // To get total size
    File.find({ path: req.params.folderId, deleted: false }, { size: 1 }).exec((error, files) => {
        if (error)
            res.status(500).json({ message: "Error while getting files", error });
        else {

            // Adding size of all files
            let folderSize = files.reduce((totSize, file) => totSize + file.size, 0);
            res.status(200).json({ folderSize });
        }
    });
});

// Soft Delete a folder
// It's patch because we are not deleting completely from DB
// But simply adding a flag to know that it is deleted
router.patch("/delete/folder/:folderId", async (req, res) => {
    try {
        let folderId = req.params.folderId;

        // Soft delete current and all subfolders
        // They will have folder id in their path
        await Folder.updateMany(
            { $or: [{ path: folderId }, { _id: folderId }], deleted: false },
            { $set: { deleted: true } }
        );

        // Delete all files nested anywhere in this folder
        await File.updateMany({ path: folderId, deleted: false }, { $set: { deleted: true } });

        res.status(200).json({ deleted: true });
    } catch (error) {
        res.status(500).json({ deleted: false, message: "Error while deleting folder", error });
    }
});

// Resume a deleted folder, its subfolders and files
router.patch("/resume/folder/:folderId", async (req, res) => {
    try {
        let folderId = req.params.folderId;

        // Resume current and all sub folders
        await Folder.updateMany(
            { $or: [{ path: folderId }, { _id: folderId }] },
            { $set: { deleted: false } }
        );

        // Resume all subfiles
        await File.updateMany({ path: folderId, deleted: false }, { $set: { deleted: false } });

        res.status(200).json({ Resumed: true });
    } catch (error) {
        res.status(500).json({ Resumed: false, message: "Error while resuming a folder", error });
    }
});

// Rename a folder
router.patch("/rename/folder/:folderId", (req, res) => {
    Folder.findByIdAndUpdate(
        req.params.folderId,
        { $set: { folderName: req.body.newFolderName } },
        { new: true }, (error, folderObj) => {
            if (error)
                res.status(500).json({ message: "Error while updating folder name", error });
            else
                res.status(200).json({ message: "Updated!" });
        });
});

// Copy-paste a folder along with all of it content like subfolders and files nested anywhere inside
router.patch("/change/folder/location", async (req, res) => {
    try {

        // Remove from current folder
        let currFolder = await Folder.findByIdAndUpdate(req.body.fromFolderId, { $pull: { folders: req.body.folderId } });

        // Add to the destination folder
        let destFolder = await Folder.findByIdAndUpdate(req.body.toFolderId, { $addToSet: { folders: req.body.folderId } });

        // Update the path of folder to destination
        let updatedFolder = await Folder.findByIdAndUpdate(req.body.folderId, { $set: { path: [...destFolder.path, destFolder._id] } }, { new: true });

        // Get all subfolders nested anywhere
        let subFolders = await Folder.find({ path: req.body.folderId }, { path: 1 });

        // Update path of all nested subfolders to new destination
        subFolders.forEach(updatePath);

        // Save paths
        for (let folder of subFolders) {
            folder = await folder.save();
        }

        // Get all files nested anywhere in the folder
        let subFiles = await File.find({ path: req.body.folderId }, { path: 1 });

        // Update path of all these files to new destination
        subFiles.forEach(updatePath);

        // Save all paths
        for (let file of subFiles) {
            file = await file.save();
        }

        res.status(200).json({ message: "Location changed!", updatedFolder, subFolders, subFiles });

        // Update path of files and folders
        // The path from current folder till end will always remain same
        // And the path of new destination folder will only be different until current folder
        function updatePath(entity) {

            // Find the index of current folder in entity path
            let folderIndex = entity.path.indexOf(req.body.folderId);
            let newPath = entity.path.slice(folderIndex);
            entity.path = [...updatedFolder.path, ...newPath];
        }
    } catch (error) {
        res.status(500).json({ message: "Error while changing folder location", error: error.toString() });
    }
});


module.exports = router;