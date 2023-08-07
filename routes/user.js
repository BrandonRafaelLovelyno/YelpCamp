const express=require('express')
const router=express.Router()
const wrapAsync=require('../utils/wrapAsync')
const User=require('../models/user')
const passport=require('passport')
const {storeReturnTo}=require('../middleware')

router.get('/register',(req,res)=>{
    res.render('user/register')
})

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.get('/logout',(req,res,next)=>{
    req.logOut((e)=>next(e))
    res.redirect('/login')
})

router.post('/register',wrapAsync( async (req,res)=>{
    try{
        const {password,username,email}=req.body
        const tempUser=new User({username,email})
        const finalUser= await User.register(tempUser,password)
        req.login(finalUser,()=>{
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error','Username is already used')
        res.redirect('/register')
    }
}))

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),wrapAsync(async(req,res)=>{
    req.flash('success',`Welcome back, ${req.user.username}!`)
    const redirectUrl=res.locals.returnTo||'/campgrounds'
    res.redirect(redirectUrl)
}
))

module.exports=router