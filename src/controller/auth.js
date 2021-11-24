const { comparePassword, generateJWT, getUserByEmail } = require('../services/users');

module.exports.auth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email or password not found' });

    const userFound = await getUserByEmail(email);
    if (!userFound) return res.status(404).json({ message: "User doesn't exists" });

    const existsPassword = await comparePassword(password, userFound.password);
    if (!existsPassword) return res.status(404).json({ message: 'Invalid password' });

    const token = await generateJWT(userFound._id);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};
