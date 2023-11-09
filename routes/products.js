const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { query } = require('express-validator');

// Obtener todos los productos (con paginación)
router.get('/', query('page').toInt(), query('limit').toInt(), async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const options = {
      page: page,
      limit: limit,
      sort: sort
    };

    const queryCriteria = query ? { category: query } : {};

    const products = await Product.paginate(queryCriteria, options);

    const result = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevPage ? `/api/products?page=${products.prevPage}&limit=${limit}` : null,
      nextLink: products.nextPage ? `/api/products?page=${products.nextPage}&limit=${limit}` : null,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    } else {
      res.json({ status: 'success', payload: product });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    } else {
      res.json({ status: 'success', payload: updatedProduct });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Eliminar un producto existente
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    } else {
      res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;