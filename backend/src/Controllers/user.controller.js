const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config(); 


exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profilePicture, bio } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET, {
      expiresIn: '7d'
    });
   
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        email: user.email, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token'); 

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { _id, username, name, bio, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id.toString(),
      { username, name, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password'); 

    res.status(201).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};