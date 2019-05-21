var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var flash = require("connect-flash");

// fetch routes
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");

// Fetch the models of object from the model folder
var Campground = require("./models/campground.js");

var Comment = require("./models/comment.js");

var methodOverride = require("method-override");
app.use(methodOverride("_method"));
/*
var user = require("./models/user.js");
*/

// get the seed file
// var seedDB = require("./seeds");

// run the seed file to reset the enviroment
// seedDB();

// line to use connect flash
app.use(flash());

// MAKE SURE TO CONFIGURE FLASH BEFORE YOU USE PASSPORT

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is my secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this will pass currentUser as a variable which can be used in any
// ejs page to access the user
// will have "currentUser" from req.user. I.e {currentUser: req.user}
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// get stylesheets, where __direname is up to /V10
app.use(express.static(__dirname + "/public"))

// mongodb atlas
//mongoose.connect('mongodb+srv://husni:Gifted99@cluster0-tukk9.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }); 

// local database
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true }); 

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";
mongoose.connect(url,{ useNewUrlParser: true });

// line for body parser
app.use(bodyParser.urlencoded({extended: true}));



// allows for us to render ejs pages.
app.set("view engine", "ejs");


// for app.js to use routes
app.use(indexRoutes);
// for campgrounds by defining "/campgrounds" it tells us to add /campgrounds
// to the beginning of each route
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000, function(){
    console.log("Yelpcamp has started")
})

/*
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started");
})
*/