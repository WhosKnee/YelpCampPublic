var mongoose = require("mongoose");

// create schema for comment
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

// create Comment model from schema
var Comment = mongoose.model("Comment", commentSchema);

// export Comment model
module.exports = Comment;