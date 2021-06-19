const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

//Import Routes
const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const teamRoutes = require('./routes/team');
const weekRoutes = require('./routes/week');
const podRoutes = require('./routes/pod');

//App
const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen (PORT, () => {
  console.log(`Party on port ${PORT}`);
});

//DB
mongoose
.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then((data) => { 
  console.log('Connected to DB');
});

var podworks = mongoose.connection;
module.exports = podworks;

var allowedDomains = ["http://localhost:5000", "http://localhost:8000", "http://72.80.156.89", "https://podworks.herokuapp.com/"];

//Middleware
app.use(express.json());
app.use(cors({
  //origin: '*',
  //origin: "http://localhost:5000",
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedDomains.indexOf(origin) === -1){
      var msg = `This site ${origin} does not have access.`
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.static('./'));

//Routes middleware
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/pods', podRoutes);

//Serve static files from the React frontend app
//app.use(express.static(path.join(__dirname, 'web/build')));

//Anything that doesn't match above, send back index.html
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/web/build/index.html'));
})*/
