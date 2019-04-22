const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const flash = require('connect-flash')
const session = require('express-session')
const expressValidator = require('express-validator')
const messages = require('express-messages');
const config = require('./config/database');
const passport = require('passport');
//app initialization
const app = express();

//middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//db connection
mongoose.connect(config.database,{useNewUrlParser:true});
let db = mongoose.connection 

db.on('error',function(err){
 console.log(err)
})

db.once('open', function(){
    console.log('Connected to MongoDB')
})

//Bring in the models
let Articles = require('./models/articles')

//set view engines

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// css initialization
app.use(express.static(path.join(__dirname, 'public')));

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }))

  //Express Messages Middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Passport Config
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

//express validator middleware
app.use(expressValidator())


//global router 

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})
//Home route
app.get('/',function(req,res){
Articles.find({}, function(err, article ){
    if(err){
        console.log(err)
    }
    else{
        res.render('index',{
            title : "Articles",
            articles : article
        })
    }
})
    
})

//Route file

let art =require('./routes/articles')
app.use('/articles',art)

let user = require('./routes/users')
app.use('/users', user)


// listening port
app.listen(3000, function(){
    console.log('Server is running..')
})



module.exports= app