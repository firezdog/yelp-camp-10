var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//LANDING
router.get("/", function(req, res) {
    res.render("landing")
});

//REGISTER
router.get("/register", function(req, res){
    res.render("login/register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render('login/register', {err: err});
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});


//LOGIN
router.get("/login", function(req, res){
    res.render("login/login", {error: req.flash("error")});
});

//AUTHENTICATE LOGIN
router.post(
    "/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login",
        failureFlash: true
    }),
    function(req, res){
    });
    
//LOGOUT
    
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports = router;