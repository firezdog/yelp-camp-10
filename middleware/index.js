var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');

var self = {

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect("/login");
    },

    isCampOwner: (req, res, next) => {
        //cannot replace with self.isLoggedIn b/c the logic is different (next call f--s up the asynchronous calls)
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }
        var id = req.params.id;
        Campground.findById(id, function(err, campground){
            if(err) {
                return res.redirect("back");
            } else {
                // needs check for undefined b/c not all cg's have authors (seed)
                if (typeof campground.author == 'undefined' || !campground.author.id.equals(req.user.id)) {
                    return res.redirect("back");
                }
            }
            return next();
        });
    },

    isCommentOwner: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }
        var commentId = req.params.comment_id;
        Comment.findById(commentId, (err, comment) => {
            if (err) { res.redirect("back"); } 
            else {
                if (!comment.author.id.equals(req.user.id)) 
                    { return res.redirect("back"); } 
                else { return next(); }
            }
        });
    }

};

module.exports = self;