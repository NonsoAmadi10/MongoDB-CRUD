const express = require('express');

const router = express.Router()

let User = require('../models/users');
const passport = require('passport');

//Bcrypt

const Bcrypt = require('bcryptjs');

//User registeration route

router.get('/register', function(req, res){
    res.render('register')
})

// Handling the user post request

router.post('/register', function(req,res){
     const name = req.body.name;
     const username = req.body.username;
     const email = req.body.email;
     const password = req.body.password;
     const password2 = req.body.password2;

     req.checkBody('name','Name is required').notEmpty();
     req.checkBody('email','Email is required').notEmpty();
     req.checkBody('email','Email is invalid').isEmail();
     req.checkBody('username','Username is required').notEmpty();
     req.checkBody('password','Password is required').notEmpty();
     req.checkBody('password2','Password do not match').equals(req.body.password);

     let errors = req.validationErrors();



     if(errors){
         
         res.render('register',{
             errors:errors,
            
         })

         
     }



     User.findOne({email:email}, (err, user)=>{
        if(user){
            console.log(err);
            
            res.render('register', {
                message: "Email Exist, Registration unsuccessful"
            })
        }
        else{
            let newUser = new User({
                name : name,
                email: email,
                username: username,
                password: password
            })
            
            Bcrypt.genSalt(10,function(err,salt){
                Bcrypt.hash(newUser.password, salt , function(err, hash){
                    if(err){
                        console.log(err)
                    }
                    newUser.password = hash;
                    newUser.save(function(err){
                        if(err){
                            
                            console.log(err)
                        }else{
                            
                            req.flash('success','Registration was Successful. You can now log in !')
                            res.redirect('/users/login')
                        }
                    })
                })
                
                
            }) 
         
         }
           
    })

    
     
     

     
     

})


router.get('/login', function(req, res){
    res.render('login')
})


//login process
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res , next)
    req.flash('success',"You have successfully Logged In");
})


router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', "You have successfully Logged out");
    res.redirect('/users/login')

})
module.exports = router