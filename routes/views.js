const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      res.render('home', { products });
    }
  });
});

// router.get('/realtimeproducts', (req, res) => {
//   res.render('realTimeProducts');
// });

router.get('/product-list', (req, res) => {
  const products = JSON.parse(data);
  res.render('productList', { products });
});

module.exports = router;
