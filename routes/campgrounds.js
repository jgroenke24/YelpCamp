const express       = require("express");
const router        = express.Router();
const Campground    = require("../models/campground");
const middleware    = require("../middleware");
const NodeGeocoder  = require('node-geocoder');
 
let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
 
let geocoder = NodeGeocoder(options);

// Index route - show all campgrounds
router.get("/", function(req, res){
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        // Get all campgrounds from db
        Campground.find({ name: regex }, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    req.flash("error", "No campgrounds match that query, please try again");
                    return res.redirect("/campgrounds");
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
            }
        });
    } else {
        // Get all campgrounds from db
        Campground.find({}, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
            }
        });
    }
});

// Create route - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // Get data from form and add to campgrounds array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].formattedAddress;
        let newCampground = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to db
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                // Redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
    });
});

// New route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show route - shows more info about one campground
router.get("/:id", function(req, res){
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err || !foundCampground) {
           req.flash("error", "Campground not found");
           res.redirect("back");
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err || !data.length){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
        // Find and update correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, Campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// Destroy campground route
router.delete("/:id/", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^S|#\s]/g, "\\$&");
}

module.exports = router;