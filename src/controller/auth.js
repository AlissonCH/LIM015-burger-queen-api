const { comparePassword, generateJWT, getUserByEmail } = require("../services/users");

// Autenticar
module.exports.auth = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email or password not found" });

  //si no existe el usuario
  const userFound = await getUserByEmail(email);
  if (!userFound) return res.status(401).json({ message: "User doesn't exists" });

  // se comparan las contraseñas
  const existsPassword = await comparePassword(password, userFound.password);
  if (!existsPassword) return res.status(401).json({ message: "Invalid password" });

  // TODO: autenticar a la usuarix
  const token = await generateJWT(userFound._id, userFound.email);
  res.json({ token });
  next();
};
