const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "auth token not present" });
  token = token.split(" ")[1];

  try {
    const payload = await jwt.verify(token, process.env.SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { verifyUser };
