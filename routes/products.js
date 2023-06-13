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
      res.json(products);
    }
  });
});

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === pid);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

router.post('/', (req, res) => {
  const product = req.body;
  product.id = Date.now().toString();

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      products.push(product);

      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al guardar el producto');
        } else {
          res.status(201).json(product);
        }
      });
    }
  });
});

router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === pid);

      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al guardar el producto actualizado');
          } else {
            res.json(products[index]);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === pid);

      if (index !== -1) {
        products.splice(index, 1);

        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar el producto');
          } else {
            res.sendStatus(204);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

module.exports = router;