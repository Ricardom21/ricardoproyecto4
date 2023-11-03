    //Importamos FS
    import fs from 'fs';

    class ProductManager {
        #path;
        #format;
    
        constructor(path) {
            this.#path = path;
            this.#format = 'utf-8';
            this.products = [];
        }
    
        async #getProductsData() {
            try {
                const data = await fs.promises.readFile(this.#path, this.#format);
                return JSON.parse(data);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log('File not found. Creating a new file.');
                    await fs.promises.writeFile(this.#path, '[]', this.#format);
                    return [];
                } else {
                    throw new Error('Error reading the file');
                }
            }
        }
    
        async #writeProductsData(products) {
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'), this.#format);
        }
    
        async #validateProduct(code) {
            const products = await this.#getProductsData();
            return products.some(product => product.code === code);
        }
    
        async #generateId() {
            const products = await this.#getProductsData();
            return products.length === 0 ? 1 : products[products.length - 1].id + 1;
        }
    
        async addProduct(title, description, price, thumbnail, code, category, stock) {
            const product = {
                id: await this.#generateId(),
                title,
                description,
                price,
                thumbnail: thumbnail || [],
                code,
                category,
                stock,
                status: true,
            };
    
            if (await this.#validateProduct(code)) {
                const products = await this.#getProductsData();
                products.push(product);
                await this.#writeProductsData(products);
                this.products = products;
                return product;
            } else {
                console.log('A product with the same code already exists');
            }
        }
    
        async getProductById(id) {
            const products = await this.#getProductsData();
            return products.find(product => product.id === id);
        }
    
        async updateProduct(id, update) {
            const products = await this.#getProductsData();
            const index = products.findIndex(product => product.id === id);
    
            if (index !== -1) {
                if (await this.#validateProduct(update.code)) {
                    products[index] = { ...products[index], ...update };
                    await this.#writeProductsData(products);
                    this.products = products;
                    console.log('Updated Product', products[index]);
                } else {
                    console.log('Error updating: A product with the same code already exists');
                }
            } else {
                console.log('Error updating: Product not found');
            }
        }
    
        async deleteProduct (id) {
            try {
                const products = await this.#getProductsData();
                const filterProducts = products.filter(item => item.id !== id);
                if (products.length !== filterProducts.length) {
                    await fs.promises.writeFile(this.#path, JSON.stringify(filterProducts, null, '\t'), this.#format);
                    this.products = filterProducts;
                    return 'Product successfully removed';
                }
                return 'The product with that id does not exist';
            } catch (error) {
                console.log(error);
                return 'Error deleting product';
            }
        }
    }
    
    export const productManager = new ProductManager('./src/api/products.json');
    

