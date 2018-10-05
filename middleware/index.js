//all middleware are here
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObject = {
    
};


middlewareObject.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //do the flash before the next page, but the message would pass into the next page
    //and this does not let the message to show up, it just pass through
    req.flash('error','Please login first to do that!');
    res.redirect('/login');
};

middlewareObject.checkCampGroundOwner= function(req,res,next){
    //check if login
    if(req.isAuthenticated()){
        //does user create this camp ground
        Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash('error','CampGround Not Found');
            console.log(err)
        } else{
            //must use equal method rather than ===, first id is object and second one is string,
            //use === would return false

            if(foundCamp.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash('error','You do not have permission to do that.');
                res.redirect('back');
            }
            
        }
    });
    }else{
        //redirect to previews page
        res.redirect('back');
    }
    

    
};
middlewareObject.checkCommentOwner = function(req,res,next){
    //check if login
    if(req.isAuthenticated()){
        //does user create this camp ground
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash('error','Comment Not Found');
            console.log(err)
        } else{
            //must use equal method rather than ===, first id is object and second one is string,
            //use === would return false

            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash('error','You do not have the permission to do that');
                res.redirect('back');
            }
        }
    });
    }else{
        //redirect to previews page
        req.flash('error','You need to login to do that');
        res.redirect('back');
    }
};

module.exports = middlewareObject;