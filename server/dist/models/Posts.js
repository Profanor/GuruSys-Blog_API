"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
