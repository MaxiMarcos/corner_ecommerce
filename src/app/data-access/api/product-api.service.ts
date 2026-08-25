import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  // Using standard Angular 17+ injection
  private http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/products`;

  /**
   * Retrieves a paginated list of products.
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param keyword Optional search keyword
   */
  getProducts(page: number = 0, size: number = 10, keyword?: string, categoryId?: number, subCategoryId?: number): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (subCategoryId !== undefined && subCategoryId !== null) {
      params = params.set('subCategoryId', subCategoryId.toString());
    }

    return this.http.get<PaginatedResponse<Product>>(this.BASE_URL, { params });
  }

  /**
   * Retrieves a single product by its ID.
   * @param id The product ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Retrieves a list of products that belong to a specific category.
   * @param categoryId The category ID
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_URL}/category/${categoryId}`);
  }
}
