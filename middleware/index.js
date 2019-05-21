// all the middleware will go here

// get campground and comment models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// create middleware obj to be returned
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        // if they are logged in do they own the campground
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    // proceed to inner code
                    next();
                } else{
                    req.flash("You do not have permissions to do that");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("You need to be logged in, to do that");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        // if they are logged in do they own the campground
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    // proceed to next function in function header
                    next();
                } else{
                    req.flash("You do not have permissions to do that");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("You need to be logged in, to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // this flash line will only allow us to access the flash in the
    // next request
    req.flash("error", "You need to be logged in, to do that");
    res.redirect("/login");
}


// will create an export object

module.exports = middlewareObj;