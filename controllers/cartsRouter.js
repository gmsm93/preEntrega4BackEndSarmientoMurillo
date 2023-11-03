const express = require('express');
const router = express.Router();
const CartManager = require('./cartManager');

const cartManager = new CartManager();


router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartWithProducts = await cartManager.getCartWithProducts(cartId);
    res.json(cartWithProducts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const result = await cartManager.removeProductFromCart(cartId, productId);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;
  try {
    const result = await cartManager.updateCartProducts(cartId, newProducts);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;
  try {
    const result = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const result = await cartManager.clearCart(cartId);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
