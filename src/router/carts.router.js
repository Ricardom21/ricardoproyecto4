import { Router } from "express";
import { cartManager }  from "../managers/CartManager.js";

const router = Router()


router.post('/', async (req, res) => {
    try {
        const addedCart = await cartManager.addCart()
        res.status(201).json({ message: 'Carrito creado', addedCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error }) 
    }
})


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        if (productId <= 0) return res.status(404).json({ error: 'Producto inválido' })

        const cart = await cartManager.addProductsToCart(cartId, productId)
    
        if (!cart) return res.status(404).json({ error: `El carrito con id ${cartId} no existe` })
        
        res.status(200).json({ message: `Producto con id ${productId} agregado al carrito`, cart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const cart = await cartManager.getCartById(cartId)

        if (!cart) return res.status(404).json({ error: `El carrito con id ${cartId} no existe` })
        res.status(200).json({ message: cart })   
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
})

export default router