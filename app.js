
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://balu:test02@cluster0.iwk3gyj.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to todolist!"
});

const item2 = new Item({
    name: "Hit + to off a new item."
});

const item3 = new Item({
    name: "<---- Hit this to delete this item."
});

const defualtItems = [item1, item2, item3];



app.get("/", function(req, res) {
    Item.find({},function(err, foundItems){

      if(foundItems.length ===0 ){
        Item.insertMany(defualtItems, function(err){
          if(err){
              console.log(err);
          }else{
              console.log("Successfully created DB...");
          }
      });
      res.redirect("/");
      }else{
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
        
    });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

  
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log('Successfully deleted...');
      res.redirect("/");
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
