var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//=======================

// comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground: campground});
        }
    })
});

// comments POST create page

router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            // create the new comment object
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                }
                else {
                    // add ID and username to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save the comment
                    newComment.save();
                    // campground refers to the one found in the findById above
                    // connect the new comment to the campground
                    campground.comments.push(newComment);
                    campground.save();
                    // set flash for new comment
                    req.flash("success", "New Comment Creates");
                    // redirect to the campground SHOW page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// comments edit route

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
   
});

// comments update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// comments DELETE route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;