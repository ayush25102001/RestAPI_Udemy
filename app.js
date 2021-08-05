//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.set("require","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wiki",{useNewUrlParser:true});//Note its matching with name of db in robo3T
const articleschema={
  title:String,
  content:String
};
const Article=mongoose.model("Article",articleschema);
app.get("/articles",function(req,res){
  Article.find({},function(err,foundarticles){
    if(!err)
    {
      res.send(foundarticles);
    }
    else{
      res.send(err);
    }
  });
});
app.post("/articles",function(req,res){
   const newarticle=new Article({
     title:req.body.title,
     content:req.body.content
   });
   newarticle.save();
   if(!err)
   {
     res.send("successfully added a entry");
   }
   else{
     res.send(err);
   }
});
app.delete("/articles",function(req,res)
{
   Article.deleteMany(function(err)
   {
   if(!err)
   {
     res.send("deleted");
   }
   else
   {
     res.send(err);
   }
 });
});
/////Request targetting a specific article/////////////
app.get("/articles/:articleTitle",function(req,res)
{
    Article.findOne({title:req.params.articleTitle},function(err,foundarticle)
  {
     if(foundarticle)
     {
       res.send(foundarticle);
     }
     else{
       res.send("Not found");
     }
  });
});
app.put("/articles/:articleTitle",function(req,res){   //completely overidded
  Article.update({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{overwrite:true});
});
app.patch("/articles/:articleTitle",function(req,res){
   Article.update({title:req.params.articleTitle},{$set:req.body});  //only required parameter is changed //$set:picks up req parameter
});
app.listen(3000,function()
{
   console.log("Server started on port 3000");
});
app.delete("/articles/:articleTitle",function(req,res){
  Article.deleteOne({
    title:req.params.articleTitle},function(err){
      if(!err){
        res.send("deleted");
      }
    }
  );
});
