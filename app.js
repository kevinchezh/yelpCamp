var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require('passport');
var localStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
var flash = require("connect-flash");

app.set('view engine','ejs');
app.use(express.static("public"));
//passport configuration
app.use(require("express-session")({
    secret:'what do you know',
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    //pass user data to every single routes
    res.locals.currentUser = req.user;
    //do not forget the next statement
    
    
    //pass message into every routes
    //error messages
    res.locals.error = req.flash('error');
    //success messages
    //we can have as many as different types of messages as possible
    res.locals.success = req.flash('success');
    next();
});
app.use(methodOverride('_method'));
//flash messages


// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_final");
app.use(bodyParser.urlencoded({extended: true}));

app.use(indexRoutes);
//this is used only all routes in certain router starts with the same string
app.use('/campGround',campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.ID, function(){
    console.log('Server started');
});