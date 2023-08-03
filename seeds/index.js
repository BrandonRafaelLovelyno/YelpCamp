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
        c= new Campground({
            title:`${sample(helper.descriptors)} ${sample(helper.places)}`,
            location:`${sample(cities).city}, ${sample(cities).state}`
        })
        c.save()
    }
}

seedDB()
    .then(()=>{
        console.log('success')
    })