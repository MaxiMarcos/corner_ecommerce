import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductApiService } from '../../../../data-access/api/product-api.service';
import { PaymentApiService } from '../../../../data-access/api/payment-api.service';
import { CartService } from '../../../../data-access/services/cart.service';
import { Product, ProductVariant } from '../../../../data-access/models/product.model';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, VariantSelectorComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductApiService);
  private paymentService = inject(PaymentApiService);
  private cartService = inject(CartService);

  product: Product | null = null;
  isLoading = true;
  error = false;
  selectedVariant: ProductVariant | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slugOrId = params.get('id');
      if (slugOrId) {
        const id = parseInt(slugOrId, 10);
        if (!isNaN(id)) {
          this.loadProduct(id);
        }
      }
    });
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.error = false;
    
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product details', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  onVariantSelected(variant: ProductVariant | null): void {
    this.selectedVariant = variant;
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) return;
    this.cartService.addToCart(this.product, this.selectedVariant, 1);
  }

  openWhatsApp(): void {
    if (!this.product || !this.selectedVariant) return;

    const phoneNumber = '5493515637590';
    const exactNumber = '5493515637590';
    const message = `Hola! Me interesa comprar el producto *${this.product.name}*\n- Talle: ${this.selectedVariant.size}\n- Color: ${this.selectedVariant.color}\n- Precio: $${this.selectedVariant.salePrice}`;
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${exactNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}
