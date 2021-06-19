const Pod = require('../models/Pod');

exports.upsertPod = async (req, res, next) => {
  try{
    let { 
      date,
      company,
      user
    } = req.body;

    //Validate
    if(!date)
      return res.status(400).json({ msg: "No date set" });

    const podRes = await Pod.findOneAndUpdate(
      {date: date, company: company},
      {$addToSet: { members: user }, $set: { company: company }},
      {upsert: true, new: true},
    )

    res.json(podRes);
  
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.readPod = async (req, res) => {
  const podRes = await Pod.findById(req.params.id);
  
  res.json(podRes);
}

exports.readPodByField = async (req, res) => {
  try{
    let data = req.query;

    const podRes = await Pod.find({...data});

    if(podRes){
      res.json(podRes)
    }else{
      res.json(false)
    }
  }catch (err) {
    console.log('Error', err)
  }
}

exports.updatePod = async (req, res) => {
  let data = req.body;

  try{
    const updatedPod = await Pod.findOneAndUpdate(
      {_id: req.params.id}, 
      {$set: {
        ...data
      }},
      {returnOriginal: false}
    );

    res.json(updatedPod)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.addUserToPod = async (req, res) => {
  try{
    const updatedPod = await Pod.findOneAndUpdate(
      {_id: req.params.id}, 
      {$addToSet: { members: req.user }},
      {returnOriginal: false}
    );

    res.json(updatedPod)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.removeUserFromPod = async (req, res) => {
  let data = req.body;
  
  try{
    const updatedPod = await Pod.findOneAndUpdate(
      {_id: req.params.id}, 
      {$pull: { members: data.id }},
      {returnOriginal: false}
    );

    res.json(updatedPod)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}