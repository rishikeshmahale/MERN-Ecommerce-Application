const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/SendEmail.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// register a user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const message = `Welcome ${name}! Your OTP for registration is ${otp}`;

      await sendEmail(email, "WELCOME, Your OTP for Registration", message);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log("Error :", err.message);
    res.status(500).json({message : "Server Error"});
  }
}; 


// user login
const loginUser = async (req, res) => {
  try {

    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : generateToken(user._id)
        })
    }
     

  } catch (err) {
    console.log("Error :", err.message);
    return res.status(500).json({message : "Server Error"});
  }
};


// get all users for admin
const getUsers = async (req, res) => {
    try{

        const users = await User.find({}).select('-password');

        return res.json(users);

    }catch(err){
        return res.status(500).json({message : "Server Error"});
    }
}



module.exports = {
    registerUser,
    loginUser,
    getUsers,
}