import fs from 'fs'

class ProductManager {
    #path 
    #format 
    constructor(path) {
        this.#path = path
        this.#format = 'utf-8'
        this.products = []
    }

    #validateProduct = async (product) => {
        const products = await this.getProducts()
        const duplicateProduct = await products.find(item => item.code === product.code)
        if (duplicateProduct !== undefined) {
            console.log('Ya existe un producto con el mismo código')
            return false
        }
        return true
    }

    getProducts = async () => {
        try {
            return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
        } catch (error) {
            console.log('error: archivo no encontrado')
            return []
        }
    }

    #generateId = async () => {
        const products = await this.getProducts()
        return products.length === 0 ? 1 : products[products.length - 1].id + 1
    }

    addProduct = async (title, description, price, thumbnail, code, category, stock) => {
        const products = await this.getProducts()
        
        const newProduct = {
            id: await this.#generateId(),
            title,
            description,
            price,
            thumbnail: thumbnail || [],
            code,
            category,
            stock,
            status: true,
        }
        
        if (await this.#validateProduct(newProduct)) {
            products.push(newProduct)
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
            this.products = products 
            return newProduct
        }
    }

    getProductById = async (id) => {
        const products = await this.getProducts() 
        const product = products.find(item => item.id === id)
        return product 
    }

    updateProduct = async (id, update) => {
        const products = await this.getProducts()
        const index = products.findIndex(item => item.id === id)
        
        if (index !== -1) {
            const isValid = await this.#validateProduct(update)
            
            if (!isValid) {
                return console.log('Error: actualización inválida')
            }
            
            products[index] = { ...products[index], ...update }
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'), this.#format)
            this.products = products
            return console.log('Producto actualizado', products[index])
        }
        return console.log('Error: Producto no encontrado')
    }

    deleteProduct = async (id) =>{
        try {
            const products = await this.getProducts()
            const filterProducts = products.filter(item => item.id !== id)
            if (products.length !== filterProducts.length) {
                await fs.promises.writeFile(
                    this.#path,
                    JSON.stringify(filterProducts, null, '\t'),
                    this.#format
                )
                this.products = filterProducts
                return 'Producto eliminado satisfactoriamente'
            }
            return 'El producto con ese id no existe'
        } catch (error) {
                console.log(error)
        }
    }
}

export const productManager = new ProductManager('./src/api/products.json')
    

