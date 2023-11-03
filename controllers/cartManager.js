const Cart = require('./models/Cart');

class CartManager {
  constructor() {
  }

  async getCartWithProducts(cartId) {
    try {
      const cartWithProducts = await Cart.findById(cartId).populate('products');
      return cartWithProducts;
    } catch (error) {
      throw new Error('Error al obtener el carrito con productos');
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products.pull(productId);
      await cart.save();
      return 'Producto eliminado del carrito correctamente';
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  async updateCartProducts(cartId, newProducts) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = newProducts;
      await cart.save();
      return 'Productos del carrito actualizados correctamente';
    } catch (error) {
      throw new Error('Error al actualizar los productos del carrito');
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await Cart.findById(cartId);
      const product = cart.products.id(productId);
      product.quantity = newQuantity;
      await cart.save();
      return 'Cantidad del producto en el carrito actualizada correctamente';
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = [];
      await cart.save();
      return 'Carrito limpiado correctamente';
    } catch (error) {
      throw new Error('Error al limpiar el carrito');
    }
  }
}

module.exports = CartManager;