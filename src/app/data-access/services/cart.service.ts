import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'corner_cart';

  // State
  private cartItemsSignal = signal<CartItem[]>(this.loadCart());
  private isCartOpenSignal = signal<boolean>(false);

  // Computed properties
  cartItems = computed(() => this.cartItemsSignal());
  isCartOpen = computed(() => this.isCartOpenSignal());
  
  totalItems = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + (item.variant.salePrice * item.quantity), 0);
  });

  constructor() { }

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem(this.CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.cartItemsSignal.set(items);
  }

  openCart(): void {
    this.isCartOpenSignal.set(true);
  }

  closeCart(): void {
    this.isCartOpenSignal.set(false);
  }

  toggleCart(): void {
    this.isCartOpenSignal.update(open => !open);
  }

  addToCart(product: Product, variant: ProductVariant, quantity: number = 1): void {
    const currentItems = [...this.cartItemsSignal()];
    const existingItemIndex = currentItems.findIndex(item => item.variant.id === variant.id);

    if (existingItemIndex !== -1) {
      // Check stock limit
      const newQuantity = currentItems[existingItemIndex].quantity + quantity;
      if (newQuantity <= variant.stock) {
        currentItems[existingItemIndex].quantity = newQuantity;
      } else {
        currentItems[existingItemIndex].quantity = variant.stock; // Max out
      }
    } else {
      // Check stock limit
      const finalQuantity = quantity > variant.stock ? variant.stock : quantity;
      if (finalQuantity > 0) {
        currentItems.push({ product, variant, quantity: finalQuantity });
      }
    }

    this.saveCart(currentItems);
    this.openCart(); // Automatically open cart when adding
  }

  updateQuantity(variantId: number, quantity: number): void {
    const currentItems = [...this.cartItemsSignal()];
    const itemIndex = currentItems.findIndex(item => item.variant.id === variantId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeFromCart(variantId);
      } else {
        const item = currentItems[itemIndex];
        if (quantity <= item.variant.stock) {
          item.quantity = quantity;
          this.saveCart(currentItems);
        }
      }
    }
  }

  removeFromCart(variantId: number): void {
    const currentItems = this.cartItemsSignal().filter(item => item.variant.id !== variantId);
    this.saveCart(currentItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }
}
