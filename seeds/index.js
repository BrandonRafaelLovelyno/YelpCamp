const cities=require('./cities')
const helper=require('./seedHelper')
const Campground=require('../models/campground')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
    .then(()=>{
        console.log('connected to database')
    })

const sample=array=>array[Math.floor(Math.random()*array.length)]

const seedDB=async function(){
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const price=Math.floor(Math.random()*20)+30;
        c= new Campground({
            title:`${sample(helper.descriptors)} ${sample(helper.places)}`,
            location:`${sample(cities).city}, ${sample(cities).state}`,
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi dolorum consequatur corporis? Odit esse veniam dolorem explicabo iusto eligendi nulla reiciendis repellendus eaque, quisquam magnam ipsa velit consequuntur consectetur eius.",
            price:price,
            images:[
                {
                    url:'https://res.cloudinary.com/dohewcyes/image/upload/v1691465781/YelpCamp/yelp1_uju12p.jpg',
                    fileName:'yelp1_uju12p',
                },
                {
                    url:'https://res.cloudinary.com/dohewcyes/image/upload/v1691465781/YelpCamp/yelp2_xgnmcy.jpg',
                    fileName:'yelp2_xgnmcy',
                },
            ],
            author:'64d01a23a54ad5c424e86744',
        })
        await c.save()
    }
}

seedDB()
    .then(()=>{
        console.log('success')
    })