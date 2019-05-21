var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// need to escape routes dir to get to middleware dir
var middleware = require("../middleware/index.js");

// INDEX - this is the page which loads the campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("./campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

// CREATE - this is the page which collects the form's input and does the logic
router.post("/", middleware.isLoggedIn, function(req, res){
   // get data from form
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, price: price, image: image, description: desc,  author: author};
   // add to campgrounds collection by creating and saving
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   })
});

// NEW - this is the page which collects the form input, by convetion we use the
// /<object>/new convention
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./campgrounds/new.ejs");
})

// SHOW - shows more information about one campground
router.get("/:id", function(req, res){
    // find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // render the template for the campground with the
            // Campground as a parameter
            res.render("campgrounds/show", {campground: foundCampground});
            }
        }
    );
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // at this point we know that the campground has been found
    // because of our middleware
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find an update the correct campground
    // req.params.id is coming from the actual id var in the route name
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campground");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
            res.redirect("/campgrounds");
    });
})


module.exports = router;