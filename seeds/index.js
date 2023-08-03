const cities=require('./cities')
const helper=require('./seedHelper')
const Campground=require('../model/campground')
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
            image:'https://source.unsplash.com/collection/483251',
            price:price,
        })
        await c.save()
    }
}

seedDB()
    .then(()=>{
        console.log('success')
    })