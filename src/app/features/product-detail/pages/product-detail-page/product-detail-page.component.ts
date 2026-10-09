import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductApiService } from '../../../../data-access/api/product-api.service';
import { PaymentApiService } from '../../../../data-access/api/payment-api.service';
import { CartService } from '../../../../data-access/services/cart.service';
import { Product, ProductVariant } from '../../../../data-access/models/product.model';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';
import { ProductGridComponent } from '../../../catalog/components/product-grid/product-grid.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, VariantSelectorComponent, ProductGridComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductApiService);
  private paymentService = inject(PaymentApiService);
  private cartService = inject(CartService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  isLoading = true;
  error = false;
  selectedVariant: ProductVariant | null = null;

  ngOnInit(): void {
    // Escuchar los cambios de la URL, para que si hacen click en un producto relacionado, recargue todo
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
    this.product = null;
    this.relatedProducts = [];
    
    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.isLoading = false;
        
        // SEO: Set dynamic title and meta
        const title = `${prod.name} - Indumentaria Corner`;
        this.titleService.setTitle(title);
        
        const description = prod.description ? prod.description.substring(0, 150) + '...' : `Comprá ${prod.name} en Indumentaria Corner. Envíos a todo el país.`;
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        if (prod.imageUrl) {
          this.metaService.updateTag({ property: 'og:image', content: prod.imageUrl });
        }

        this.loadRelatedProducts(prod);
      },
      error: (err) => {
        console.error('Error loading product details', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  private loadRelatedProducts(prod: Product): void {
    // Stop words that are generic clothing terms
    const stopWords = ['camiseta', 'camisetas', 'short', 'shorts', 'buzo', 'buzos', 'campera', 'camperas', 'joggins', 'pantalon', 'medias', 'conjunto', 'titular', 'suplente', 'niño', 'niños', 'seleccion', 'equipo'];
    
    // Find the first meaningful word in the product name
    const words = prod.name.toLowerCase().split(/\s+/);
    let keywordToSearch = '';
    
    for (const word of words) {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w\sáéíóúñ]/g, '');
      if (cleanWord.length > 2 && !stopWords.includes(cleanWord)) {
        keywordToSearch = cleanWord;
        break; // found the primary keyword (e.g. "Boca", "River", "Argentina")
      }
    }

    // Try fetching by keyword first
    if (keywordToSearch) {
      this.productService.getProducts(0, 5, keywordToSearch).subscribe(res => {
        // Filter out the current product
        let related = res.content.filter(p => p.id !== prod.id);
        
        // If we didn't get enough results (less than 4), fill with products from same category
        if (related.length < 4) {
          this.productService.getProductsByCategory(prod.categoryId).subscribe(catProducts => {
            const catFiltered = catProducts.filter(p => p.id !== prod.id && !related.find(r => r.id === p.id));
            related = [...related, ...catFiltered].slice(0, 4);
            this.relatedProducts = related;
          });
        } else {
          this.relatedProducts = related.slice(0, 4);
        }
      });
    } else {
      // Fallback if no keyword was found
      this.productService.getProductsByCategory(prod.categoryId).subscribe(catProducts => {
        this.relatedProducts = catProducts.filter(p => p.id !== prod.id).slice(0, 4);
      });
    }
  }

  onVariantSelected(variant: ProductVariant | null): void {
    this.selectedVariant = variant;
  }

  get displayPrice(): number | null {
    if (this.selectedVariant) return this.selectedVariant.salePrice;
    if (this.product && this.product.variants.length > 0) return this.product.variants[0].salePrice;
    return null;
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
