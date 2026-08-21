import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductApiService } from '../../../../data-access/api/product-api.service';
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

  product: Product | null = null;
  isLoading = true;
  error = false;
  selectedVariant: ProductVariant | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(Number(id));
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

  openWhatsApp(): void {
    if (!this.product || !this.selectedVariant) return;

    const phoneNumber = '5493517614221'; // Removed +, added 9 for Argentina standard WA routing if needed, but 543517614221 usually works too. Let's use exactly 543517614221
    const exactNumber = '543517614221';
    const message = `Hola! Me interesa comprar el producto *${this.product.name}*\n- Talle: ${this.selectedVariant.size}\n- Color: ${this.selectedVariant.color}\n- Precio: $${this.selectedVariant.salePrice}`;
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${exactNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}
