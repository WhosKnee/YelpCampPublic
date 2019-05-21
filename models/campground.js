var mongoose = require("mongoose");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    // one-to-many association. One campground can have many comments
    // these are references to comments
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"   
        }

    ]
});

// in the parameters use the singular of the object name and the schema
// this will create a collection of Campgrounds in our yelpCamp db
var Campground = mongoose.model("Campground", campgroundSchema);

// export the model
module.exports = Campground;