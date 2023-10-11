const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los carritos de compras');
    } else {
      const cartData = JSON.parse(data);
      const cart = cartData.carritos.find((c) => c.id === cid);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).send('Carrito de compras no encontrado');
      }
    }
  });
});

router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los carritos de compras');
    } else {
      let cartData = JSON.parse(data);
      const cart = cartData.carritos.find((c) => c.id === cid);
      if (cart) {
        const existingProduct = cart.products.find((p) => p.product === pid);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.products.push({ product: pid, quantity: 1 });
        }
        fs.writeFile('carrito.json', JSON.stringify(cartData), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al guardar el carrito de compras');
          } else {
            res.status(201).json(cart);
          }
        });
      } else {
        res.status(404).send('Carrito de compras no encontrado');
      }
    }
  });
});

module.exports = router;
