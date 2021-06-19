const Team = require('../models/Team');

exports.createTeam = async (req, res, next) => {
  try{
    let { 
      name,
      company,
      members
    } = req.body;

    //Validate
    if(!name)
      return res.status(400).json({ msg: "Fields are empty" });

    const existingTeam = await Team.findOne({name: name});

    if(existingTeam)
      return res.status(400).json({ msg: "A team with this name already exists" });

    const newTeam = new Team({
      name,
      company,
      members
    });

    const savedTeam = await newTeam.save();
    res.json(savedTeam);
  
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.readTeam = async (req, res) => {
  const teamRes = await Team.findById(req.params.id);
  res.json(teamRes);
}

exports.readUserTeams = async (req, res) => {
  const teamRes = await Team.find({ members: req.user });
  res.json(teamRes);
}

exports.readTeamByField = async (req, res) => {
  try{
    let data = req.query;

    const teamRes = await Team.find({...data});

    if(teamRes){
      res.json(teamRes)
    }else{
      res.json(false)
    }
  }catch (err) {
    console.log('Error', err)
  }
}

exports.updateTeam = async (req, res) => {
  let data = req.body;

  try{
    const updatedTeam = await Team.findOneAndUpdate(
      {_id: req.params.id}, 
      {$set: {
        ...data
      }},
      {returnOriginal: false}
    );

    res.json(updatedTeam)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.deleteTeam = async (req, res) => {
  const existingTeam = await Team.findOne({ admin: req.user, _id: req.params.id });
  
  if(!existingTeam) return res.status(400).json({ msg: "No property found with this ID" });

  //Validate
  if(!existingTeam.admin.includes(req.user)){
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const deletedTeam = await Team.findByIdAndDelete(req.params.id);
  res.json(deletedTeam);
}