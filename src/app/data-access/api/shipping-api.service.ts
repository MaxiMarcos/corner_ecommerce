import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShippingOptionDto {
  id: string;
  provider: string;
  modality: string;
  cost: number;
  estimatedDeliveryTime: string;
}

export interface ShippingItemDto {
  productVariantId: number;
  quantity: number;
}

export interface ShippingCalculateRequestDto {
  zipCode: string;
  items: ShippingItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class ShippingApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shipping`;

  calculateShipping(request: ShippingCalculateRequestDto): Observable<ShippingOptionDto[]> {
    return this.http.post<ShippingOptionDto[]>(`${this.apiUrl}/calculate`, request);
  }
}
