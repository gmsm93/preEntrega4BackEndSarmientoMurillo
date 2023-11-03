const express = require('express');
const router = express.Router();
const CartManager = require('./cartManager');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const cartManager = new CartManager();


router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const query = req.query.query || '';
  const sort = req.query.sort || 'asc'; 

  try {
    let filter = {};
    if (query) {
      filter = { category: query };
    }

    const products = await Product.find(filter)
      .sort({ price: sort === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);


    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevLink = hasPrevPage ? `/products?page=${page - 1}&limit=${limit}` : null;
    const nextLink = hasNextPage ? `/products?page=${page + 1}&limit=${limit}` : null;

    res.render('products', {
      products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartWithProducts = await cartManager.getCartWithProducts(cartId);
    res.render('cart', { cart: cartWithProducts });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
