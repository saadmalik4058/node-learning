const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    "my-secret-key",
    {
      expiresIn: "1h",
    }
  );
};

module.exports = generateToken;