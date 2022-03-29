require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) res.sendStatus(401).send({msg:"User not logged in"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) res.sendStatus(403);
      req.user = user;
      next()
    });
  }
  // SPECIFIC SUBSCRIBER ACCESS
const authTokenAndAuthorization = (req, res, next) => {
  authenticateToken(req, res, () => {
      if (req.user.id === req.params.id || req.params.id || req.user.admin) {
          next();
      } else {
          res.status(403).json("You are not authorized!!");
      }
  });
};
// ADMIN ACCESS
const authTokenAndAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
      if (req.user.admin){
      next();
      } else {
          res.status(403).json(" You are not authorized");
      }
  });
}

module.exports = {
  authenticateToken,
  authTokenAndAuthorization,
  authTokenAndAdmin
}
  // module.exports = authenticateToken;