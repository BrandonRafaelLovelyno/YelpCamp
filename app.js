if(!process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const dbUrl=process.env.ATLAS_LINK||'mongodb://127.0.0.1:27017/yelp-camp'
const express = require('express')
const mongoose = require('mongoose')
const User=require('./models/user')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const methodOverride=require('method-override')
const app=express()
const ejsMate=require('ejs-mate')
const campgroundRoute=require('./routes/campground')
const reviewRoute=require('./routes/review')
const userRoute=require('./routes/user')
const ExpressError=require('./utils/ExpressError')
const session=require('express-session')
const flash=require('connect-flash')
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')
const MongoDBStore=require('connect-mongo')


mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const db=mongoose.connection
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',()=>{
    console.log('connected to mongosh')
})

const store=MongoDBStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*3600,
    crypto:{
        secret:process.env.COOKIES_SECRET
    }
})

const sessionConfig={
    store,
    name:'connection',
    secret:process.env.COOKIES_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views','views')

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session(sessionConfig))
app.use(mongoSanitize())
app.use(helmet({contentSecurityPolicy:false,}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash())
app.use((req,res,next)=>{
    res.locals.loggedUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/',userRoute)
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)

app.get('/',(req,res)=>{
    res.render('home')
})

const port=process.env.PORT||3000

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})

app.use((res,req,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    res.render('error',{err})
})
