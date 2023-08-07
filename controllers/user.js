const User=require('../models/user')

module.exports.renderRegisterForm=(req,res)=>{
    res.render('user/register')
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('user/login')
}

module.exports.logOut=(req,res,next)=>{
    req.logOut((e)=>next(e))
    res.redirect('/login')
}

module.exports.register=async (req,res)=>{
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
}

module.exports.login=async(req,res)=>{
    req.flash('success',`Welcome back, ${req.user.username}!`)
    const redirectUrl=res.locals.returnTo||'/campgrounds'
    res.redirect(redirectUrl)
}