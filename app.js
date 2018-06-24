let express = require("express");
let app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    let campgrounds = [
        {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
        {name: "Granite Hill", image: "https://farm4.staticflickr.com/3539/3314646074_cb608e578b.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm8.staticflickr.com/7246/7468674992_b8db31480e.jpg"}
    ];
    
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});