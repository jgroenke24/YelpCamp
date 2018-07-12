const express           = require("express");
const app               = express();
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const passport          = require("passport");
const LocalStrategy     = require("passport-local");
const methodOverride    = require("method-override");
const Campground        = require("./models/campground");
const Comment           = require("./models/comment");
const User              = require("./models/user");
const seedDB            = require("./seeds");

// Requiring routes
const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();  // Seed the database

// Passport configuration
app.use(require("express-session")({
    secret: "I can't think of anyting better",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});