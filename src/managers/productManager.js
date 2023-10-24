//Importamos FS
import fs from 'fs'

//creo la clase 
export default class ProductManager {
    constructor (){
        this.path = "./src/files/productos.json"
        this.products = []
    }

    //Validacion para que el codigo no se repita
    validateCode = async (code) => {
        try{ 
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)

            return this.products.some((producto) => producto.code == code)
        } catch (err) {
            return err
        }

    }

    //muestro los priductos
    getProducts =  async (limit) => {
        try{
            if(!fs.existsSync(this.path)) return this.products

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const productosFiltrados = limit ? this.products.slice(0,limit) : this.products
            return productosFiltrados

        } catch (err) {
            return err
        }
        
    }

    //agrego 1 producto
    getAddProducts = async (producto) => {

        try{ 
            if(!fs.existsSync(this.path)) {
            //Valido que haya ingresado todos los campos ya que son obligatorios
                if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
                    return "Te falto algun dato"
                }
                
                //creo el producto
                const product = {
                    id: this.products.length + 1,
                    title: producto.title,
                    description: producto.description,
                    price: producto.price,
                    thumbnail: producto.thumbnail,
                    code: producto.code,
                    stock: producto.stock
                }

                this.products.push(product)

                await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,'\t'))
                return "Se Creo el producto correctamente"
            } 

            //Tomo los datos del .JSON
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)

            //Valido que no se repita el codigo
            const validacion = await this.validateCode(producto.code)
            if (validacion){
                return "El producto ya existe"
            } 

            //Valido que haya ingresado todos los campos ya que son obligatorios
            if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
                return "Te falto algun dato"
            }
            
            //creo el producto
            const product = {
                id: this.products.length + 1,
                title: producto.title,
                description: producto.description,
                price: producto.price,
                thumbnail: producto.thumbnail,
                code: producto.code,
                stock: producto.stock
            }

            //Agrego el producto al array
            this.products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,'\t'))
            return "Se Creo el producto correctamente"
        }catch (err) {
            return err
        }
        
        
    }

    //Muestro 1 producto buscando el id dentro del array
    getProductById = async (id) => {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const producto = this.products.find(product => product.id === id)

            return producto ? producto : 'Not found'
        } catch (err) {
            return err
        }
    }

    //Modifico 1 producto
    updateProduct = async (id, update) => {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            let producto = this.products.find(product => product.id === id)

            for(let propiedad in update){
                if(producto.hasOwnProperty(propiedad)){
                    producto[propiedad] = update[propiedad]
                }
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,'\t'))
            return "Se modifico el producto correctamente"
        } catch (err) {
            return err
        }
    }

    deleteProduct = async (id) => {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const productos = this.products.filter(product => product.id !== id)

            await fs.promises.writeFile(this.path, JSON.stringify(productos,null,'\t'))
            return "Se elimino el producto correctamente"
        } catch (err) {
            return err
        }
    }
}
