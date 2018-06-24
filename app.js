let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let campgrounds = [
    {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
    {name: "Granite Hill", image: "https://farm4.staticflickr.com/3539/3314646074_cb608e578b.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm8.staticflickr.com/7246/7468674992_b8db31480e.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    // Get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // Redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});