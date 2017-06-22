const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionConfig = require('./sessionConfig');
const app = express();
const port = process.env.PORT || 3000;


app.engine("mustache", mustacheExpress());
app.set("views","./public");
app.set("view engine", "mustache");


//Middleware
app.use("/", express.static("./public"))
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(sessionConfig));

function checkAuth(req, res, next){
    if(!req.session.user){
        return res.redirect('/login');
    } else{
        next();
    }
}

var validUsers = [{
    "username":"miketyson",
    "password":"thepope"},{
        "username": "michaeljordan",
        "password": "thegoat"}];

app.get("/", checkAuth, function(req, res){
    res.render("index", {user:req.session.user});
})

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", function(req, res){
    if(!req.body || !req.body.username || !req.body.password){ //either did not fill out form or not completed
        return res.redirect("/login");
    }
    var requestingUser = req.body;
    var userRecord;
    validUsers.forEach(function(item){
        if (item.username === requestingUser.username){
            userRecord = item;
        }
    })
    if(!userRecord){
        console.log('breaking here?!?');
        return res.redirect("/login");
    }
    if(requestingUser.password == userRecord.password){
        req.session.user = userRecord.username;
        return res.redirect("/");
    }
    else {
        return res.redirect("/login");
    }
})

app.listen(port, function(req, res){
    console.log("Server is running on port", port);
})