const express = require('express');

const router = express.Router()


let Articles = require('../models/articles')
let User = require('../models/users')

router.get('/add',ensureAuth ,function(req, res){
    res.render('add_articles')
})
// add submit post request
router.post('/add',ensureAuth,function(req,res){
req.checkBody('title','Title is required').notEmpty();
//req.checkBody('author','Author is required').notEmpty();
req.checkBody('body','Body is required').notEmpty();

let errors = req.validationErrors()

if(errors){
    res.render('add_articles',{
        errors:errors
    })
}else{

let article = new Articles();
article.title = req.body.title;
article.author = req.user._id;
article.body = req.body.body;
article.save(function(err){
    if(err){
        console.log(err)
    }else{
        req.flash("success","Article has been added");
        res.redirect('/')
    }
})

}
})
//Get single article

router.get('/:id', function(req, res){
    let query = {_id : req.params.id}
    Articles.findById(query, function(err, article){
        User.findById(article.author, function(err, user){
            if(err){
                console.log(err)
            }else{
                res.render('article_details', {
                    article: article,
                    author: user.name
                })
            }
        })
    })
})
    

//Load Edit form

router.get('/edit/:id',ensureAuth, function(req, res){
    
    Articles.findById(req.params.id, function(err, article){
        if(article.author !== req.user._id){
            req.flash('danger', "Not authorized");
            res.redirect('/')
        }
        
        else{
            res.render('Edit_articles',{
                article : article
            })
        }
    })
})

//Post Edit form

router.post('/edit/:id',function(req,res){
    let query ={_id:req.params.id}
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    Articles.updateOne( query, article, function(err){
        if(err){
            console.log(err)
        }else{
            req.flash('success','Article updated')
            res.redirect('/')
        }
    })
    
    })

    //Delete Article Route

router.delete('/:id',ensureAuth, function(req,res){
    if(!req.user._id){
        res.status(500).send()
    }
    let query = {_id: req.params.id};
    Articles.findById(req.params.id, function(err, result){
    if(article.author !== req.user._id){
        res.status(500).send()
    }else{
        Articles.deleteOne(query, function(err){
            if(err){
                console.log(err)
            }else{
                res.send('success')
            }
        })

    }
    })
    
})


function ensureAuth(req, res , next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("danger", "You need to be logged in");
        res.redirect('/users/login')
    }
}

module.exports = router