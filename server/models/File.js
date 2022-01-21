const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const FileSchema = new Schema({
    fileName: { type: String, required: true },
    size: Number,
    format: String,
    path: [{ type: ObjectId, ref: "Folder" }],  // Keeps track of all parent folders from root to nearest parent in an order
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model("File", FileSchema);