const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/', (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  let filteredProducts = productManager.getAllProducts();

  if (query) {
    filteredProducts = filterProducts(filteredProducts, query);
  }

  if (sort && (sort === 'asc' || sort === 'desc')) {
    filteredProducts = sortProducts(filteredProducts, sort);
  }

  const paginatedProducts = getPaginatedResults(filteredProducts, page, limit);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
  const nextLink = hasNextPage ? `/api/products?page=${parseInt(page) + 1}&limit=${limit}` : null;

  const result = {
    status: 'success',
    payload: paginatedProducts,
    totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: hasNextPage ? parseInt(page) + 1 : null,
    page: parseInt(page),
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  };

  res.json(result);
});


function filterProducts(products, query) {
  return products.filter(product => {
    return product.category === query;
  });
}

function sortProducts(products, sort) {
  return products.sort((a, b) => {
    return sort === 'asc' ? a.price - b.price : b.price - a.price;
  });
}

function getPaginatedResults(products, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return products.slice(startIndex, endIndex);
}

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
