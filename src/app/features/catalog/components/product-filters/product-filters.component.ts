import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryApiService } from '../../../../data-access/api/category-api.service';
import { Category } from '../../../../data-access/models/category.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.css'
})
export class ProductFiltersComponent implements OnInit {
  private categoryService = inject(CategoryApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  isLoading = true;

  ngOnInit(): void {
    // Load categories
    this.categoryService.getCategories(0, 50).subscribe({
      next: (res) => {
        this.categories = res.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading = false;
      }
    });

    // Listen to route query params to highlight the active category
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['categoryId'] ? Number(params['categoryId']) : null;
    });
  }

  selectCategory(categoryId: number | null): void {
    // Navigate to the same route but update the categoryId query param
    // Preserve existing keyword if any
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoryId: categoryId || null },
      queryParamsHandling: 'merge' // keeps other params like keyword
    });
  }
}
