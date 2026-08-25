import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/paginated-response.model';

export interface SubCategory {
  id: number;
  name: string;
  supplierId?: number;
  supplierName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubCategoryApiService {
  private http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/subcategories`;

  getSubCategories(page: number = 0, size: number = 1000): Observable<PaginatedResponse<SubCategory>> {
    return this.http.get<PaginatedResponse<SubCategory>>(`${this.BASE_URL}?page=${page}&size=${size}`);
  }
}
