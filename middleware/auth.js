const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({error: "No authentication token, authorization denied"});

    const validatedUser = jwt.verify(token, process.env.TOKEN_SECRET);

    if(!validatedUser) return res.status(401).json({ error: "Token verification failed, authorization denied" });

    req.user = validatedUser.id;
    next();

  }catch(err){
    return res.status(500).json({ error: err.message });
  }
}

module.exports = auth;