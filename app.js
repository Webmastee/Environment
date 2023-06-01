//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: 'password'});

const User = new mongoose.model('User', userSchema);





app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', (req, res) => {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save();
    res.render('secrets')
    
});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    async function getUser() {
        try {
          const user = await User.findOne({ email: username });

          console.log(user);

          if(user.password == password) {
            res.render('secrets')
          }
          mongoose.connection.close();
        } catch (err) {
          console.error(err);
        }
      }
      
      getUser();

    // User.findOne({email: username}, (err, foundUser) => {
    //     if(err) {
    //         console.log(err)
    //     } else{
    //         if(foundUser) {
    //             if(foundUser.password === password) {
    //                 res.render('secrets')
    //             }
    //         }
    //     }
    // })

})
app.listen(3000, () => {
    console.log("Server is running perfectly on prot 3000")
})