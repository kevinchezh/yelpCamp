var express = require("express");
var router = express.Router();
//  .. means went to upper dir
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
//Give you the overview of all campground
router.get('/',function(req,res){
    Campground.find({},function(err,allplaces){
        //req.user save the info of user logged in, and if no user login, then it would be undefined
        
        if(err){
            console.log(err);
        }
        else{
            console.log(allplaces);
            //pass in the user data as well
            res.render('campgrounds/campGround',{campgrounds:allplaces, currentUser:req.user});
        }
    });
    
});

//Use to insert new campground and return to campground list page
router.post('/',middleware.isLoggedIn, function(req,res){
    console.log(req.body);
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    Campground.create(
        {
            name:name,
            image:image,
            description:description,
            price:price,
            author:{
                id: req.user._id,
                username: req.user.username
            }
        },function(err,campground){
            if(err){
                console.log(err);
            }
            else{
                console.log('camp inserted!');
                console.log(campground);
                res.redirect('/campGround');
            }
        });
    
    });

//insert new camp ground page
router.get('/new', middleware.isLoggedIn,function(req, res) {
   res.render('campgrounds/insertcamp'); 
});

//SHOW details of one selected campground
router.get('/:id',function(req, res) {
    //comments here ref to the schema name in campground
    //long syntax here is used for loading full assosiate data in campground schema
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render('campgrounds/show',{campground:foundCamp});
        }
    })
    
});


//edit page of campground
//check if user logged in
//does user create this camp ground
router.get('/:id/edit',middleware.checkCampGroundOwner,function(req,res){
    

    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash('error','CampGround Not Found');
        }
        res.render('campgrounds/edit',{campground:foundCamp});
    }); 
});
//UPDATE
router.put('/:id',middleware.checkCampGroundOwner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updataCamp){
        if(err){
            console.log(err);
        }else{
            res.redirect('/campGround/' + req.params.id);
        }
    });
    
})




//delete campground
router.delete('/:id',middleware.checkCampGroundOwner,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Comment deleted!');
            res.redirect('/campGround');
        }
    });
});




module.exports = router;