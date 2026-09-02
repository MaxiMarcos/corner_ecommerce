import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../data-access/services/cart.service';
import { PaymentApiService } from '../../../data-access/api/payment-api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  private paymentService = inject(PaymentApiService);

  isProcessingPayment = false;

  checkout(): void {
    const items = this.cartService.cartItems();
    if (items.length === 0) return;

    this.isProcessingPayment = true;

    const paymentItems = items.map(item => ({
      productVariantId: item.variant.id,
      quantity: item.quantity
    }));

    this.paymentService.createPreference({ items: paymentItems }).subscribe({
      next: (res) => {
        // Redirigir a Mercado Pago
        window.location.href = res.initPoint;
      },
      error: (err) => {
        console.error('Error creating payment preference', err);
        this.isProcessingPayment = false;
        alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
      }
    });
  }
}
