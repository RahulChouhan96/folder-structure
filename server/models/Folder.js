const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const FolderSchema = new Schema({
    folderName: { type: String, required: true },
    files: [{ type: ObjectId, ref: "File" }],       // All nearest files inside this folder
    folders: [{ type: ObjectId, ref: "Folder" }],   // All nearest subfolders
    path: [{ type: ObjectId, ref: "Folder" }],      // Keeps track of all parent folders from root to nearest parent in an order
    deleted: { type: Boolean, default: false }
});

module.exports = model("Folder", FolderSchema);