const Company = require('../models/Company');

exports.createCompany = async (req, res, next) => {
  try{
    let { 
      name,
      domains,
      members,
      seats,
      limit
    } = req.body;

    //Validate
    if(!name)
      return res.status(400).json({ msg: "Fields are empty" });

    const existingCompany = await Company.findOne({domains: name});

    if(existingCompany){
      let exists = existingCompany.members.find(mem => mem === req.user);

      if(!exists){
        //Add new member
        let members = [...existingCompany.members, req.user];

        //Update company
        const updatedCompany = await Company.findOneAndUpdate(
          {_id: existingCompany._id}, 
          {$set: {
            members: members
          }},
          {returnOriginal: false}
        );
    
        res.json(updatedCompany);
        return
      }else{
        res.json(existingCompany);
        return
      }
    }

    const newCompany = new Company({
      name,
      domains,
      members,
      seats,
      limit
    });

    const savedCompany = await newCompany.save();
    res.json(savedCompany);
  
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.readCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json(company);
}

exports.updateCompany = async (req, res) => {
  let data = req.body;

  try{
    const updatedCompany = await Company.findOneAndUpdate(
      {_id: req.params.id}, 
      {$set: {
        ...data
      }},
      {returnOriginal: false}
    );

    res.json(updatedCompany)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

exports.deleteCompany = async (req, res) => {
  const existingCompany = await Company.findOne({ admin: req.user, _id: req.params.id });
  
  if(!existingCompany) return res.status(400).json({ msg: "No company found with this ID" });

  //Validate
  if(!existingCompany.admin.includes(req.user)){
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const deletedCompany = await Company.findByIdAndDelete(req.params.id);
  res.json(deletedCompany);
}