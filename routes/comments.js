var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//require a dir would automatically call the index file
var middleware = require("../middleware");
//comments routes
router.get('/campGround/:id/comments/new',middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.render('comments/new',{campground:campground});
        }
    })
    
});

//post new comment
router.post('/campGround/:id/comments',middleware.isLoggedIn,function(req,res){
    //if user is not logged in, cannot post new comment
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash('error','Oops, something went wrong');
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //add username and id to comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success','Comment added successfully');
                    res.redirect('/campGround/'+ campground._id);
                }
            });
        }
    });
});

//edit comments
//comment path is under post path, so we need to connect two path together
//the path here, second id is different from the first one(commentid and post id)
//so we need to change the name to make sure they are different
router.get('/campGround/:id/comments/:comment_id/edit',middleware.checkCommentOwner,function(req,res){
    console.log('see here1!!!!!!!!');
    console.log(req.params.id);
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            console.log(err);
        }else{
            res.render('comments/edit',{campground_id: req.params.id,comment:foundComment});
        }
    })
    
});
//update comment route
router.put('/campGround/:id/comments/:comment_id',middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
        if(err){
            console.log(err);
        } else{
            res.redirect('/campGround/' + req.params.id);
        }
    })
});

//destroy comment
router.delete('/campGround/:id/comments/:comment_id',middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Comment deleted!');
            res.redirect('/campGround/' + req.params.id);
        }
    })
});

module.exports = router;