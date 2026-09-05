import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../data-access/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  get minPrice(): number {
    if (!this.product.variants || this.product.variants.length === 0) return 0;
    return Math.min(...this.product.variants.map(v => v.salePrice));
  }

  get maxPrice(): number {
    if (!this.product.variants || this.product.variants.length === 0) return 0;
    return Math.max(...this.product.variants.map(v => v.salePrice));
  }

  get productSlug(): string {
    if (!this.product || !this.product.name) return `${this.product.id}`;
    const slug = this.product.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return `${this.product.id}-${slug}`;
  }
}
