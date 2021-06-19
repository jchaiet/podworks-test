const Week = require('../models/Week');

exports.createWeek = async (req, res, next) => {
  try{
    let { 
      first_day,
      last_day,
      days
    } = req.body;

    //Validate
    if(!first_day)
      return res.status(400).json({ msg: "Fields are empty" });

    const existingWeek = await Week.findOne({first_day: first_day});

    if(existingWeek)
      return res.status(400).json({ msg: "This week has already been created" });

    const newWeek = new Week({
      first_day,
      last_day,
      days
    });

    const savedWeek = await newWeek.save();
    res.json(savedWeek);
  
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.readWeek = async (req, res) => {
  const weekRes = await Week.findById(req.params.id);
  
  res.json(weekRes);
}

exports.readWeekByDate = async (req, res) => {
  let field = {...req.body};

  const weekRes = await Week.findOne(field);

  if(weekRes){
    res.json(weekRes)
  }else{
    res.json(false)
  }
}

exports.updateWeek = async (req, res) => {
  let data = req.body;

  try{
    const updatedWeek = await Week.findOneAndUpdate(
      {_id: req.params.id}, 
      {$set: {
        ...data
      }},
      {returnOriginal: false}
    );

    res.json(updatedWeek)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}
