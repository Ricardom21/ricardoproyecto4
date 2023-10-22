import fs from 'fs';

class productManager {
  constructor(filePath = 'product.json') {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    const productId = lastId + 1;
    product.id = productId;

    this.products.push(product);
    this.saveProducts();

    console.log(`Producto '${product.title}' añadido con éxito. (ID: ${productId})`);
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      return product;
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
      return null;
    }
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      for (const key in updatedFields) {
        if (updatedFields.hasOwnProperty(key)) {
          this.products[productIndex][key] = updatedFields[key];
        }
      }

      this.saveProducts();

      console.log(`Producto con ID ${productId} actualizado con éxito.`);
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
    }
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      console.log(`Producto con ID ${productId} eliminado.`);
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
    }
  }

  saveProducts() {
    const productsJSON = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, productsJSON);
    console.log(`Productos guardados en el archivo "${this.path}".`);
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      console.log(`Productos cargados desde el archivo "${this.path}".`);
    } catch (error) {
      console.log(`No se pudo cargar el archivo "${this.path}". Se iniciará con una lista vacía de productos.`);
      this.products = [];
    }
  }
}

export default productManager;
