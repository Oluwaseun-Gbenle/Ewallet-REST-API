const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";
const mongoose = require('mongoose');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const ewalletSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  username: String,
  password: String,
  walletbalance: Number,
  amountSent:[{receiver: String, amount: Number}],
  amountReceived:[{sender: String, amount: Number}],
});

const Ewallet = mongoose.model("Ewallet", ewalletSchema);

app.get("/api/users", function (req, res) {
  var dataArr = [
    {
      fname: "Lola",
      lname: "James",
      username: "lola_james@gmail.com",
      password: "jamesLo123%",
      walletbalance: 10456,
      amountSent:[],
      amountReceived:[],
    },

    {
      fname: "Chinedu",
      lname: "Okoro",
      username: "chineduJoe@gmail.com",
      password: "Hilltop$3",
      walletbalance: 69876,
      amountSent:[],
      amountReceived:[],
    },

    {
      fname: "Mahmoud",
      lname: "Audu",
      username: "Auduaudu_@yahoo.com",
      password: "MrAudu^1",
      walletbalance: 295615,
      amountSent:[],
      amountReceived:[],
    },

    {
      fname: "Stephen",
      lname: "Sans",
      username: "stephensans@outlook.com",
      password: "Macbeth7$",
      walletbalance: 1002334,
      amountSent:[],
      amountReceived:[],
    },

    {
      fname: "James",
      lname: "Alfred",
      username: "Jamiejune@gmail.com",
      password: "Jamie4june@",
      walletbalance: 345664,
      amountSent:[],
      amountReceived:[],
    },

    {
      fname: "Rita",
      lname: "Rogers",
      username: "PrettyRita@gmail.com",
      password: "Ritarita4l_",
      walletbalance: 2000,
      amountSent:[],
      amountReceived:[],
    }
  ]

  Ewallet.find({}, function (err, data) {
    if (err) console.error(err);
    else {
      if (data.length == 0) {
        Ewallet.create(dataArr, function (err, data) {
          if (err) console.error(err);
          return res.json(data);
        });
      } else {
        res.send(data);
      }
    }
  });
});

app.post("/api/users/update",function(req,res){   
 Ewallet.findByIdAndUpdate(req.body.senderId,
{$push:{ amountSent: {receiver: req.body.receiver, amount: req.body.walletbalance}}, $inc:{ walletbalance: - req.body.walletbalance }},
{new:true}, (err,data) =>{
  if (err) console.error(err);
   else{
     if(Ewallet == data){
 res.send('Data already inputed')
   }
   else{
    res.json(data);   
   }
   }
 });  

   Ewallet.findByIdAndUpdate(req.body.receiverId, 
{$push:{ amountReceived: {sender: req.body.sender, amount: req.body.walletbalance}},$inc:{ walletbalance: + req.body.walletbalance }}, 
{new:true}, (err,data) =>{
  if (err) console.error(err);
   else{
    res.json(data);   
   }
}); 

}) 

const { Types } = require("mongoose");
const toObjId = (id) => {
  return Types.ObjectId(id);
};
app.get("/api/users/details/:id", function (req, res) {
 Ewallet.findById(toObjId(req.params.id), function (err, data) {
    if (err) console.error(err);
      else {
      return  res.send(data);
      }
  });
});

app.post("/api/users/delete-transactions",function(req,res){   
  Ewallet.findByIdAndUpdate(req.body.userId,
 {$set:{ amountSent: [],amountReceived: []}},
 {new:true}, (err,data) =>{
   if (err) console.error(err);
    else{
     res.json(data);   
    }
  });  
 })

const listener = app.listen(process.env.PORT || 5000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
