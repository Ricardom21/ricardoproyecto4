import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


let productos = [];

// Manejo de la vista
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

io.on('connection', (socket) => {

  socket.on('agregar_producto', (producto) => {
    productos.push(producto);
    io.emit('actualizar_productos', productos);
  });

  socket.on('eliminar_producto', (productoId) => {
    productos = productos.filter(item => item.id !== productoId);
    io.emit('actualizar_productos', productos);
  });
});


app.post('/agregarproducto', (req, res) => {
  const nuevoProducto = req.body; 

 
  io.emit('agregar_producto', nuevoProducto);

  res.redirect('/realtimeproducts'); 
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});