const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try{
    const wholetoken = req.headers.authorization.split(' ')[0];
    //const test = req.headers.authorization.substr(6);
    //console.log("test = " + test);
    //const token = req.headers.authorization.split(' ')[1];
    //console.log("key = " + key);
    const token = wholetoken.substr(6);
    // console.log("token = " + token);
    // console.log('middleware, here');
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed by check-auth.js!"});
  }
};
