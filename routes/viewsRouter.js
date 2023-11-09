const express = require('express');
const router = express.Router();
const CartManager = require('./cartManager');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const cartManager = new CartManager();

const options = {
  page:1 , 
  limit: 10
};

router.get = (req, res) => {
  Cart.paginate({}, options, (err, docs) => { 
    res.send({
      items:docs
    })
  })
}


router.get('/products', async (req, res) => {
  Cart.paginate({}, options, (err, docs) => { 
    res.send({
      items:docs
    })
  })
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
