const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article" , articleSchema);

/////////////////////////////////////////// FOR ALL ARTICLES /////////////////////////////////////////////////////////

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        } else {
            console.log(err);
        }
    })
})  
    
.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully Added");
        } else {
            res.send(err);
        }
    });
        
})
    
.delete(function(req,res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Successfully Deleted");
        } else {
            res.send(err)
        }
    })

});


/////////////////////////////////////////// FOR SPECIFIC ARTICLE /////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    const requiredArticle = req.params.articleTitle;

    Article.findOne({title: requiredArticle},function(err,foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No matching article found");
        }
    });
})


.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        function(err){
            if (err){
                res.send(err);
            } else {
                res.send("Successfully Updated");
            }
        }
    )
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        { $set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            } else {
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle} , function(err){
        if (!err){
            res.send("Successfully Deleted");
        } else {
            res.send(err);
        }
    })
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
})