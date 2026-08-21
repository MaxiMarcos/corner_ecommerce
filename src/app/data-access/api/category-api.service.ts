import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { PaginatedResponse } from '../models/paginated-response.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  private http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/categories`;

  /**
   * Retrieves a paginated list of categories.
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param keyword Optional search keyword
   */
  getCategories(page: number = 0, size: number = 10, keyword?: string): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<PaginatedResponse<Category>>(this.BASE_URL, { params });
  }
}
