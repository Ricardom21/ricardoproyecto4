import express from 'express';
import CartManager from './CartManager';
const cartsRouter = express.Router();
const cartManager = new CartManager(); 

// Ruta raíz POST /api/carts/
cartsRouter.post('/', (req, res) => {
  const newCart = req.body;
  cartManager.addCart(newCart);
  res.status(201).json(newCart);
});

// Ruta GET /api/carts/:cid
cartsRouter.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado.` });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity || 1);
  cartManager.addProductToCart(cartId, productId, quantity);
  res.json({ message: `Producto con ID ${productId} añadido al carrito con ID ${cartId}.` });
});

export default cartsRouter;
