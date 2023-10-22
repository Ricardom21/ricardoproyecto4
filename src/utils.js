import express from 'express';
import { uploader } from './multerConfig'; 

const app = express();

// Ruta para subir una imagen
app.post('/api/upload', uploader.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
  }

  const imageUrl = `http://tu-sitio-web.com/images/${req.file.originalname}`;
  res.json({ imageUrl });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
