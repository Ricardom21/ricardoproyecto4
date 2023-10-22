import express from 'express';
import ProductManager from '"./productManager.js"git ';
const app = express();
const port = 8080;

const productManager = new ProductManager("../product.json");

app.use(express.json());

app.get('/productos', (req, res) => {
  const products = productManager.getProducts();
  res.json({products});
});

app.get('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = productManager.getProductById(id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/productos', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.status(201).json(newProduct);
});

app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedFields = req.body;
  productManager.updateProduct(id, updatedFields);
  res.json({ message: 'Producto actualizado con éxito' });
});

app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  productManager.deleteProduct(id);
  res.json({ message: 'Producto eliminado con éxito' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


