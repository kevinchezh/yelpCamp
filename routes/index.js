var express = require("express");
//mergeParams here. Sometimes in order to shorter the route path, we write duplicant path in app.js,
//but that dulicant part could contain something like :id, that means :id would not pass in index.js file anymore
//So we use mergeParams to get the params in the common path.
var router = express.Router({mergeParams:true});
var passport = require("passport");
var User = require("../models/user");

router.get('/',function(req,res){
    res.render('campgrounds/index');
});






//AUTH ROUTES
//show register form
router.get('/register',function(req, res) {
    //here we pass though flash message into rendered page
    res.render('register');
});
//post the sign up form
router.post('/register',function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            //This could pass err to be flash message
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
            
        }
        //this part is for login the user after register
        passport.authenticate('local')(req,res,function(){
            //welcome message
            req.flash('success','Welcome to YelpCamp: ' + user.username);
            res.redirect('/campGround'); 
        });
    });
});

//login route
router.get('/login',function(req, res) {
    res.render('login');
});

//handler login post request
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campGround',
    failureRedirect:'/login'
}),function(req, res) {
    
});

//logout route
router.get('/logout',function(req, res) {
    req.logout();
    req.flash('success','Logout successfully!');
    res.redirect('/campGround');
})





module.exports = router;