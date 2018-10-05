var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
    name: 'someplace123',
    image: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/health/2017/12/27/china-clones-first-gene-edited-dog-but-its-sentenced-to-die-heart-disease/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1514395122840.jpg?ve=1&tl=1&text=big-top-image',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
    name: 'farewell well',
    image: 'http://www.hssv.org/assets/img/what-we-do/whatwedo_adopt_availableanimals_dog.jpg',
    description: 'Look at him!'
    },
    {
    name: 'SunRise farm',
    image: 'https://edge.alluremedia.com.au/m/l/2017/10/top10doggos.jpg',
    description: 'Run out of things to say'
    }
]
function seedDB(){
    //remove all camp first
    Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
    console.log('remove campground');
    //add a few campgrounds
    //Order of functions are not guaranteed even if we write a function after another
    //so in order to make sure the order of functions, we should put later function
    //into the first one
    data.forEach(function(seed){
        Campground.create(seed, function(err,campground){
            if(err) {
                console.log(err);
            } else{
                console.log('add campground');
                
                //add a comment
                Comment.create({
                    text:'Ohh man, that is so true',
                    author: 'Sara'
                },function(err,comment){
                    if(err){
                        console.log(err);
                    } else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log('comment added');
                    }
                });
            }
        });
    });
});
    
    
    
};

module.exports = seedDB;