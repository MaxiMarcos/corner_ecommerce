import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../data-access/services/cart.service';
import { PaymentApiService, PaymentRequestDto } from '../../../../data-access/api/payment-api.service';
import { ShippingApiService, ShippingOptionDto, ShippingCalculateRequestDto } from '../../../../data-access/api/shipping-api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  public cartService = inject(CartService);
  private paymentService = inject(PaymentApiService);
  private shippingService = inject(ShippingApiService);
  private router = inject(Router);

  checkoutForm!: FormGroup;
  isProcessingPayment = false;
  shippingCost = 0; 
  shippingOptions: ShippingOptionDto[] = [];
  isCalculatingShipping = false;

  ngOnInit(): void {
    if (this.cartService.cartItems().length === 0) {
      this.router.navigate(['/']);
    }

    this.checkoutForm = this.fb.group({
      buyerName: ['', [Validators.required, Validators.minLength(2)]],
      buyerLastName: ['', [Validators.required, Validators.minLength(2)]],
      buyerEmail: ['', [Validators.required, Validators.email]],
      buyerPhone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{8,15}$')]],
      deliveryMethod: ['LOCAL_PICKUP', Validators.required],
      address: [''],
      city: [''],
      zipCode: ['']
    });

    this.checkoutForm.get('deliveryMethod')?.valueChanges.subscribe(method => {
      // If it's a shipping method, address/city/zip are required
      if (method !== 'LOCAL_PICKUP') {
        this.checkoutForm.get('address')?.setValidators(Validators.required);
        this.checkoutForm.get('city')?.setValidators(Validators.required);
        this.checkoutForm.get('zipCode')?.setValidators(Validators.required);
      } else {
        this.checkoutForm.get('address')?.clearValidators();
        this.checkoutForm.get('city')?.clearValidators();
        this.checkoutForm.get('zipCode')?.clearValidators();
        this.shippingCost = 0;
      }
      this.checkoutForm.get('address')?.updateValueAndValidity();
      this.checkoutForm.get('city')?.updateValueAndValidity();
      this.checkoutForm.get('zipCode')?.updateValueAndValidity();

      // Update shipping cost based on selection
      if (method !== 'LOCAL_PICKUP') {
        const option = this.shippingOptions.find(o => o.id === method);
        if (option) {
          this.shippingCost = option.cost;
        }
      }
    });

    this.checkoutForm.get('zipCode')?.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(zip => {
      if (zip && zip.length >= 4) {
        this.calculateShipping(zip);
      } else {
        this.shippingOptions = [];
        this.shippingCost = 0;
      }
    });
  }

  private calculateShipping(zipCode: string): void {
    this.isCalculatingShipping = true;
    
    const request: ShippingCalculateRequestDto = {
      zipCode: zipCode,
      subtotal: this.cartService.subtotalPrice(),
      items: this.cartService.cartItems().map(item => ({
        productVariantId: item.variant.id,
        quantity: item.quantity
      }))
    };

    this.shippingService.calculateShipping(request).subscribe({
      next: (options) => {
        this.shippingOptions = options;
        this.isCalculatingShipping = false;
        
        // Auto-select first option if we were on "HOME_DELIVERY" or similar
        const currentMethod = this.checkoutForm.get('deliveryMethod')?.value;
        if (currentMethod !== 'LOCAL_PICKUP' && options.length > 0) {
          this.shippingCost = options[0].cost;
          this.checkoutForm.get('deliveryMethod')?.setValue(options[0].id, { emitEvent: false });
        }
      },
      error: (err) => {
        console.error('Error calculating shipping', err);
        this.shippingOptions = [];
        this.isCalculatingShipping = false;
      }
    });
  }

  get totalWithShipping(): number {
    return this.cartService.subtotalPrice() + this.shippingCost;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartService.cartItems().length === 0) return;

    this.isProcessingPayment = true;

    const formValues = this.checkoutForm.value;
    const paymentItems = this.cartService.cartItems().map(item => ({
      productVariantId: item.variant.id,
      quantity: item.quantity
    }));

    const request: PaymentRequestDto = {
      items: paymentItems,
      buyerName: formValues.buyerName,
      buyerLastName: formValues.buyerLastName,
      buyerEmail: formValues.buyerEmail,
      buyerPhone: formValues.buyerPhone,
      deliveryMethod: formValues.deliveryMethod,
      address: formValues.deliveryMethod === 'HOME_DELIVERY' ? formValues.address : null,
      city: formValues.deliveryMethod === 'HOME_DELIVERY' ? formValues.city : null,
      zipCode: formValues.deliveryMethod === 'HOME_DELIVERY' ? formValues.zipCode : null
    };

    this.paymentService.createPreference(request).subscribe({
      next: (res) => {
        window.location.href = res.initPoint;
      },
      error: (err) => {
        console.error('Error creating payment preference', err);
        this.isProcessingPayment = false;
        alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
      }
    });
  }
}
