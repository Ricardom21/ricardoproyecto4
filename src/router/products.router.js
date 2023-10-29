import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const productsFilePath = path.join(__dirname, '../files/productos.json');

// Ruta para mostrar la lista de productos en la vista 'home.handlebars'
router.get('/home', (req, res) => {
  try {
    const productos = cargarProductos();
    res.render('home', { productos });
  } catch (err) {
    res.status(500).send('Error al cargar la vista de productos: ' + err);
  }
});

// Función para cargar los productos desde el archivo JSON
const cargarProductos = () => {
  try {
    const datos = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    return [];
  }
};

export default router;