const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  try {
    const { username, email, password, passwordConfirm ,firstName, lastName } = req.body;

    if (!username || !email || !password || !passwordConfirm || !firstName || !lastName ) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).send({ error: 'Passwords do not match' });
    }
    
    const existUser = await User.exists({email}).exec();
    if (existUser) {
      return  res.status(400).send({ error: 'Email already in use' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName
        });
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }

  } catch (err) {
    res.status(500).send({ error: err.message });
  }


  
}