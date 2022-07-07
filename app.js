const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bryondickers:Ntr4hS4sX4IO1rkT@cluster0.jodeden.mongodb.net/TodoListDB");

const liItemtSchema = new mongoose.Schema({
    itemName:String
});
const LiItemModel = mongoose.model("list",liItemtSchema);


const listArrSchema = new mongoose.Schema({
    titleName:String,
    listArray:[liItemtSchema]
})
const ListArrModel = mongoose.model("listArr",listArrSchema);

const item1 = new LiItemModel({
    itemName:"go for running"
});
const item2 = new LiItemModel({
    itemName:"Take breakfast"
})
const item3 = new LiItemModel({
    itemName:"Go for shower"
})

const defaultArray = [item1,item2,item3];

app.get("/",function (req,res) { 
    //
    //it checks if found items in the db is empty, then it insert the items

    LiItemModel.find(function (err, arrItems){
        if (err) {
            console.log(err);
        } else {
            if (arrItems.length === 0) {
                LiItemModel.insertMany(defaultArray,function (err) { 
                    if(err){
                        console.log(err);
                    }
                 }); 
                 res.redirect("/")           
            }else{

                LiItemModel.find(function (error, itemsfound) { 
                    if (error) {
                        console.log(error);
                    } else {

                        res.render("index",{titleList:"Today",itemAdded:itemsfound});
                                        
                        
                    }
                 })
            }
        }

    })
}
);

app.post("/delete",function (req,res) { 

    const itemId = req.body.checkbox;
    const titName = req.body.titleName;

   if (titName === "Today") {
    LiItemModel.deleteOne({_id:itemId},function (err) {
        if(err){
            console.log(err);
        }
      })
    res.redirect("/");
    
   } else {

    ListArrModel.findOneAndUpdate({titleName:titName},{$pull:{listArray:{_id:itemId}}},function (err,foundIte) {

            if (err) {
                console.log(err);
            }
    
    })
    res.redirect("/"+titName);
        
    
   }
    
 })





app.post("/",function (req,res) {

    const itemAddToLi = req.body.itemName;
    const btnTitleName = req.body.btnName;
    
    const addItem = new LiItemModel({
        itemName:itemAddToLi
    })

    if(btnTitleName === "Today"){  
        addItem.save();
        res.redirect("/");
    
    }else{

        ListArrModel.findOne({titleName:btnTitleName},function (err, foundItem) { 
            if(err){
              console.log(err);
            }else{
              foundItem.listArray.push(addItem);
              foundItem.save(); 
            }
         })
         res.redirect("/"+ btnTitleName); 

    }


  })


app.get("/:title", function(req,res) {
        
        const ttle = req.params.title;
        const getParams =  _.capitalize(ttle);
    
        
        ListArrModel.findOne({titleName:getParams}, function (err,itemfound) { 
            if (err) {
                console.log(err);
            } else {
                if (itemfound) {
    
                    res.render("index",{titleList:itemfound.titleName, itemAdded:itemfound.listArray})
                } else {
                    const addToArry = new ListArrModel({
                        titleName:getParams,
                        listArray:defaultArray 
                    })
                    addToArry.save();
                    res.redirect("/"+getParams);
                }
            }
         })
})

let port = process.env.PORT;
if (port == null || port == "") {
   port = 3000;
}

app.listen(port,function () {
    console.log("Server has started running");
})