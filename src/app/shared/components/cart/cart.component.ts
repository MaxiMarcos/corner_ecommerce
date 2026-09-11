import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../data-access/services/cart.service';
import { PaymentApiService } from '../../../data-access/api/payment-api.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  isProcessingPayment = false;

  checkout(): void {
    const items = this.cartService.cartItems();
    if (items.length === 0) return;

    // Close the cart before navigating
    this.cartService.toggleCart();
    
    // Navigate to checkout
    this.router.navigate(['/checkout']);
  }
}
