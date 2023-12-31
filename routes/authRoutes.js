const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).send('El usuario ya existe');
      }
  
      const newUser = new User({
        email,
        password,
        role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
      });
  
      await newUser.save();
  
      res.status(201).send('Usuario creado correctamente');
    } catch (error) {
      res.status(500).send('Error en el registro');
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Credenciales incorrectas');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Credenciales incorrectas');
    }
    req.session.user = user;
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al cerrar sesión');
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;