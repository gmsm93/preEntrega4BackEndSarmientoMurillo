class ProductManager {
  constructor() {
    this.products = []; 
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  addProduct(newProduct) {
    newProduct.id = (new Date()).getTime().toString(); 
    this.products.push(newProduct);
  }

  updateProduct(productId, updatedProduct) {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
    }
  }

  deleteProduct(productId) {
    this.products = this.products.filter(product => product.id !== productId);
  }
}

module.exports = ProductManager;
