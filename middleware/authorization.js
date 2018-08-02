var Campground = require('../models/campgrounds');

module.exports = {

    isLoggedIn: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect("/login");
    },

    isCampOwner: function(req, res, next) {
        var id = req.params.id;
        if (!req.isAuthenticated()){
            return res.redirect("/login");
        }
        Campground.findById(id, function(err, campground){
            if(err) {
                console.log(err);
            } else {
                if (typeof campground.author.id == 'undefined' || !campground.author.id.equals(req.user.id)) {
                    return res.redirect("back");
                }
            }
            return next();
        });
    }   

};