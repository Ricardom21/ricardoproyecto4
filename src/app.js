import express from 'express';
import cartsRouter from './router/carts.router.js';
import productsRouter from './router/products.router.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.use('/api/products' , productsRouter)
app.use('/api/carts' , cartsRouter)

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

