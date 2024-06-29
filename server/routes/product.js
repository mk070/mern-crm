// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a product
router.post('/', async (req, res) => {
  try {
    const { name, code, description, category, price } = req.body;
    const product = new Product({
      name,
      code,
      description,
      category,
      price
    });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
