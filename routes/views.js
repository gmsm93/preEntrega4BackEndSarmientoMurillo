const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { query } = require('express-validator');


router.get('/', query('page').toInt(), query('limit').toInt(), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: page,
      limit: limit
    };

    const products = await Product.paginate({}, options);

    res.render('home', { products: products.docs }); 
  } catch (err) {
    res.status(500).send('Error al leer los productos');
  }
});


router.get('/product-list', query('page').toInt(), query('limit').toInt(), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: page,
      limit: limit
    };

    const products = await Product.paginate({}, options);

    res.render('productList', { products: products.docs });
  } catch (err) {
    res.status(500).send('Error al leer los productos');
  }
});

module.exports = router;
