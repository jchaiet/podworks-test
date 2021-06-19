const express = require('express');
const router = express.Router();
let path = require('path');
const auth = require('../middleware/auth');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const { 
  register, 
  login, 
  logout, 
  getUser, 
  getUserByField, 
  deleteUser, 
  updateUser, 
  isTokenValid, 
  isLoggedIn 
} = require('../controllers/auth');

//Image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(allowedFileTypes.includes(file.mimetype)){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

let upload = multer({ storage, fileFilter });

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.delete('/delete', auth, deleteUser);
router.post("/isTokenValid", isTokenValid);
router.get("/isLoggedIn", isLoggedIn);
router.post("/read", getUserByField);
router.post("/update/:id", updateUser);
router.post("/update/avatar/:id", upload.single('photo'), updateUser);
router.get("/", auth, getUser);

module.exports = router;