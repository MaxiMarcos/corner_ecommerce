import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentItemDto {
  productVariantId: number;
  quantity: number;
}

export interface PaymentRequestDto {
  items: PaymentItemDto[];
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryMethod: string;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
}

export interface PaymentResponseDto {
  preferenceId: string;
  initPoint: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  createPreference(request: PaymentRequestDto): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(`${this.apiUrl}/preference`, request);
  }
}
