import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductVariant } from '../../../../data-access/models/product.model';

@Component({
  selector: 'app-variant-selector',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.css'
})
export class VariantSelectorComponent implements OnChanges {
  @Input({ required: true }) variants: ProductVariant[] = [];
  @Output() variantSelected = new EventEmitter<ProductVariant | null>();

  colors: string[] = [];
  sizes: string[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;
  selectedVariant: ProductVariant | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variants'] && this.variants) {
      this.extractOptions();
    }
  }

  private extractOptions(): void {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    this.variants.forEach(v => {
      if (v.color) colorSet.add(v.color);
      if (v.size) sizeSet.add(v.size);
    });

    this.colors = Array.from(colorSet);
    this.sizes = Array.from(sizeSet);

    // Auto-select if only one option exists
    if (this.colors.length === 1) this.selectColor(this.colors[0]);
    if (this.sizes.length === 1) this.selectSize(this.sizes[0]);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.checkVariant();
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.checkVariant();
  }

  private checkVariant(): void {
    if (this.selectedColor && this.selectedSize) {
      this.selectedVariant = this.variants.find(
        v => v.color === this.selectedColor && v.size === this.selectedSize
      ) || null;
      this.variantSelected.emit(this.selectedVariant);
    }
  }
}
