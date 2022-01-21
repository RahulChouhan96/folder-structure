const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const FolderSchema = new Schema({
    folderName: { type: String, required: true },
    files: [{ type: ObjectId, ref: "File" }],
    folders: [{ type: ObjectId, ref: "Folder" }],
    path: [{ type: ObjectId, ref: "Folder" }],
    originalId: { type: ObjectId, ref: "Folder" }
});

module.exports = model("Folder", FolderSchema);