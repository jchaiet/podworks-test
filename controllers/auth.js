const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createJWT,
} = require("../utils/auth");
const fs = require('fs');
let path = require('path');

const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)*$/;

exports.register = async (req, res, next) => {
  try{
    let { full_name, email, role, password } = req.body;

    //Validate
    if(!full_name || !email || !password)
      return res.status(400).json({ msg: "Please complete all required fields" });

    if(password.length < 5) 
      return res.status(400).json({ msg: "Password needs to be at least 6 characters long" });

    /*if(password !== passwordConfirm) 
      return res.status(400).json({ msg: "Passwords do not match" });*/
    //Make sure user account doesn't already exist
    const existingUser = await User.findOne({email: email});
    if(existingUser)
      return res.status(400).json({ msg: "An account with this email already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      full_name,
      email,
      password: passwordHash,
      role,
      status: 'active'
    });

    const savedUser = await newUser.save();
    
    //Create JWT Token
    const token = jwt.sign({id: savedUser._id}, process.env.TOKEN_SECRET);

    res.cookie("token", token, { httpOnly: true }).send();

  }catch(err){
    res.status(500).send();
  }
}

exports.login = async (req, res) => {
  try{
    const { email, password } = req.body;

    //Validate
    if(!email || !password) return res.status(400).json({ msg: "Fields are empty" });

    const user = await User.findOne({email: email});

    if(!user) 
      return res.status(400).json({ msg: "Wrong email or password" });

    if(user.status === 'inactive')
      return res.status(400).json({ msg: "This account has been deactivated" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) 
      return res.status(400).json({ msg: "Wrong email or password" });

    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET);

    res.cookie("token", token, { httpOnly: true}).send();
  }catch(err){
    res.status(500).send(); 
  }
}

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true
    }).send();
  }catch(err){
    return res.json(null);
  }
}

exports.updateUser = async (req, res) => {
  try {
    let data = req.body;

    if(data.remove){
      const oldPath = path.join(__dirname, '..', 'images', data.remove)

      if(fs.existsSync(oldPath)){
        fs.unlink(oldPath, (err) => {
          if(err){
            console.error(err)
            return;
          }

          res.status(200)
        })
      }
    }

    if(req.file){
      data.avatar = req.file.filename;
    }

    const updatedUser = await User.findOneAndUpdate(
      {_id: req.params.id}, 
      {$set: { 
        ...data
      }},
      {returnOriginal: false}
    ).select('-password');

    res.json(updatedUser)
  }catch(err){
    res.status(500).send();
  }
}

exports.getUserByField = async (req, res) => {
  try{
    let field = {...req.body};
    let key = Object.keys(field);

    let id = field[key[0]];

    if(key == 'id'){
      const user = await User.findById(id).select('-password');
      res.json(user);
    }else{
      const userRes = await User.findOne(field);
      if(userRes) {
        res.json({
          id: userRes._id,
          full_name: userRes.first_name,
          email: userRes.email,
          role: userRes.role,
          company: userRes.company
        })
      }else{
        res.json(false);
      }
    }
 
  }catch(err){
    res.status(500).send();  
  }
}

exports.deleteUser = async (req, res) => {
  try{
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

exports.isTokenValid = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token) return res.json(false);

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if(!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if(!user) return res.json(false);

    return res.json(true);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

exports.isLoggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;

    if(!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.TOKEN_SECRET);

    res.json(validatedUser.id);
  }catch(err){
    return res.json(null);
  }
}

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  res.json(user);
}