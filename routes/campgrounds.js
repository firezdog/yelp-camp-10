var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var check = require('../middleware');

//INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds});
        }
    });
});

//NEW (FORM)
router.get("/new", check.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE (POST)
router.post("/", check.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    author = {id: req.user.id, username: req.user.username};
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log(err);
        }
        else {
            campground.author.id = req.user.id;
            campground.author.username = req.user.username;
            campground.save();
            res.redirect("/campgrounds");
        }
    });    
});

//EDIT FORM
router.get("/:id/edit", check.isCampOwner, function(req,res){
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground});
        }
    });
});

//FORM SUBMISSION (EDIT)
router.put("/:id/update", check.isCampOwner, function(req,res) {
    var id = req.params.id;
    Campground.findByIdAndUpdate(id,req.body, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.redirect(`/campgrounds/${id}`);
        }
    }); 
});

//DELETE SUBMISSION

router.delete("/:id/delete", check.isCampOwner, function(req,res){
    console.log("delete route");
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//SHOW (MUST BE AT END TO PREVENT INTERPRETATION OF OTHER ROUTES AS ID)
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;