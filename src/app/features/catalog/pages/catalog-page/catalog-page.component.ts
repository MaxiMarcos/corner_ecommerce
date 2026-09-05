import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductApiService } from '../../../../data-access/api/product-api.service';
import { Product } from '../../../../data-access/models/product.model';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css'
})
export class CatalogPageComponent implements OnInit, OnDestroy {
  private productService = inject(ProductApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  isLoading = true;
  error = false;
  
  currentPage = 0;
  totalPages = 0;
  pageSize = 8; // Number of items per page

  // Carousel Properties
  carouselImages = [
    'assets/images/carruselCamisetas.jpg',
    'assets/images/carruselDiego.jpg'
  ];
  currentCarouselIndex = 0;
  private carouselTimer: any;

  ngOnInit(): void {
    this.startCarousel();
    this.route.queryParams.subscribe(params => {
      const keyword = params['keyword'];
      const categoryName = params['categoria'];
      const subCategoryName = params['subcategoria'];
      this.currentPage = params['page'] ? Number(params['page']) : 0;
      
      this.loadProducts(keyword, categoryName, subCategoryName);

      if (keyword || categoryName || subCategoryName) {
        setTimeout(() => {
          const element = document.getElementById('catalog-header');
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }

  startCarousel(): void {
    this.carouselTimer = setInterval(() => {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselImages.length;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  private loadProducts(keyword?: string, categoryName?: string, subCategoryName?: string): void {
    this.isLoading = true;
    this.error = false;
    
    // Fetch paginated products
    this.productService.getProducts(this.currentPage, this.pageSize, keyword, categoryName, subCategoryName).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: pageNumber },
        queryParamsHandling: 'merge'
      });
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private handleError(err: any): void {
    console.error('Failed to load catalog products', err);
    this.error = true;
    this.isLoading = false;
  }
}
