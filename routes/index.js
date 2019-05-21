var express = require("express");
// mergeParams is crucial so that params from our routes are automatically used
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


// =============================================
// AUTH ROUTES
// =============================================

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    })
})

// show login form
    // passport.authrnticate is the middleware to authenticate a login
    // from the passport-local-mongoose package
router.get("/login", function(req, res){
    // error was the keyword used if isLoggedIn middleware failed.
    res.render("login");
})

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
})

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
})

module.exports = router;
