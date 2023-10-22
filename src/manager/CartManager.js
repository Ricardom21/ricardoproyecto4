import fs from 'fs';


class cartManager {
  constructor(filePath = 'carts.json') {
    this.path = filePath;
    this.carts = [];
    this.loadCarts();
  }

  addCart(cart) {
    const lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
    const cartId = lastId + 1;
    cart.id = cartId;

    this.carts.push(cart);
    this.saveCarts();

    console.log(`Carrito con ID ${cartId} creado con éxito.`);
  }

  getCartById(cartId) {
    const cart = this.carts.find((c) => c.id === cartId);
    if (cart) {
      return cart;
    } else {
      console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
      return null;
    }
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      return;
    }

    const product = ProductManager.getProductById(productId);
    if (!product) {
      return;
    }

    const existingItem = cart.items.find((item) => item.product.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    this.saveCarts();

    console.log(`Producto con ID ${productId} añadido al carrito con ID ${cartId}.`);
  }

  saveCarts() {
    const cartsJSON = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, cartsJSON);
    console.log(`Carritos guardados en el archivo "${this.path}".`);
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
      console.log(`Carritos cargados desde el archivo "${this.path}".`);
    } catch (error) {
      console.log(`No se pudo cargar el archivo "${this.path}". Se iniciará con una lista vacía de carritos.`);
      this.carts = [];
    }
  }
}

export default cartManager;
