
const hashHelper = require(process.cwd() +'/helpers/password-encrypter')
const jwt = require('jsonwebtoken');

const { getUserByEmail } = require('../CRUD/user')

async function login(req, res){
  try {
    const { email, password } = req.body;
    
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isPasswordValid = await hashHelper.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          message: "Invalid password",
          password: hashHelper.hash(password),
          password2: user.password,
        });
    }

    // Tạo token sử dụng jsonwebtoken
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({ 
      token,
      message: "Login successful!"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", email: req.body.email });
  }
};


module.exports = login