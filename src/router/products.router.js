import express from 'express';
import ProductManager from './src/manager/productManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager(); 

// Ruta raíz GET /api/products/
productsRouter.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
});

// Ruta GET /api/products/:pid
productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: `Producto con ID ${productId} no encontrado.` });
  }
});

// Ruta raíz POST /api/products/
productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;
  productManager.updateProduct(productId, updatedFields);
  res.json({ message: `Producto con ID ${productId} actualizado.` });
});

// Ruta DELETE /api/products/:pid
productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.deleteProduct(productId);
  res.json({ message: `Producto con ID ${productId} eliminado.` });
});

export default productsRouter;
