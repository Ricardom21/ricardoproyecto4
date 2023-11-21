import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter from './router/views.router.js'
import messageModel from './dao/models/messages.models.js'



const app = express();
app.use(express.json());

await mongoose.connect('mongodb+srv://ricardoabraham00:JVoLfk6Ohy70yAlu@clusterr14.dkq7byv.mongodb.net/ecommerce')

const PORT = 8080 
const httpServer = app.listen(PORT, () => console.log(`Server is running on ${PORT}`))

const io = new Server(httpServer)

app.set('socketio', io)

app.use(express.static(`${__dirname}/public`))


app.engine('handlebars',handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


app.get('/', (req, res) => res.status(200).render('index', { name: 'Ricardo'}))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/home', viewsRouter)

io.on('connection', async socket => {
  console.log('Nuevo cliente conectado')
  socket.on('productList', data => {
      io.emit('updatedProducts', data)
  })
  let messages = (await messageModel.find()) ? await messageModel.find() : []

  socket.broadcast.emit('alerta')
  socket.emit('logs', messages)
  socket.on('message', data => {
      messages.push(data)
      messageModel.create(messages)
      io.emit('logs', messages)
  })
 
})







