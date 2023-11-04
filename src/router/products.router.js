import { Router } from 'express'
import { productManager } from '../managers/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts()

    if (limit) {
        const limitedProducts = products.slice(0, limit)
        res.status(206).json( limitedProducts )
    } else  {
        return res.status(200).json({ products: products })
    } 

})

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)         
    const product = await productManager.getProductById(productId)
    
    if (!product) return res.status(404).json({ error: `El producto con id ${productId} no se encontró` })
    
    return res.status(200).json({ product: product })
})

router.post('/', async (req, res) => {
    try {
        let {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
        } = req.body
        
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }
        
        const addedProduct = await productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            (status = true)
        )
        
        if (addedProduct) {
            const products = await productManager.getProducts()
            
            req.app.get('socketio').emit('updatedProducts', products)
            
            return res.status(201).json({ message: `Producto con id ${addedProduct.id} agregado satisfactoriamente`, product: addedProduct })
        }
        return res.status(404).json({ error: 'Error adding product' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid) 
        const products = await productManager.getProducts()
        
        if (req.body.id !== productId && req.body.id !== undefined) {
            return res.status(404).json({ error: 'No es posibe identificar un producto con ese id'})
        }
        
        const updated = req.body
        const productFind = await products.find(item => item.id === productId)
        
        if (!productFind) {
            return res.status(404).json({ error: `El producto con id ${productId} no existe` })
        }

        await productManager.updateProduct(productId, updated)
        const updatedProducts = await productManager.getProducts() 

        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        
        res.status(200).json({ message: `Actualización satisfactoria del producto con id ${productId}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error})
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid) 
        const products = await productManager.getProducts()
        const productFind = await products.find(item => item.id === productId)
        
        if (!productFind) {
            return res.status(404).json({ error: `El producto con id ${productId} no existe` })
        }
        
        const deletedProduct = await productManager.deleteProduct(productId)
        console.log(deletedProduct)
        
        const updatedProducts = await productManager.getProducts()
        
        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        
        res.status(200).json({ message: `Producto con id ${productId} eliminado satisfactoriamente`, products: await productManager.getProducts() })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})

export default router