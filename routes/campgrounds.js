const express       = require("express");
const router        = express.Router();
const Campground    = require("../models/campground");

// Index route - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// Create route - add new campground to database
router.post("/", function(req, res){
    // Get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// New route - show form to create new campground
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

// Show route - shows more info about one campground
router.get("/:id", function(req, res){
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

module.exports = router;