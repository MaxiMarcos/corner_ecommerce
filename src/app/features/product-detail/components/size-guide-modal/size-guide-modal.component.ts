import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-size-guide-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './size-guide-modal.component.html',
  styleUrl: './size-guide-modal.component.css'
})
export class SizeGuideModalComponent {
  @Input() isOpen = false;
  @Input() initialCategory: 'camisetas' | 'shorts' | 'buzos' = 'camisetas';
  @Output() close = new EventEmitter<void>();

  activeTab: 'camisetas' | 'shorts' | 'buzos' = 'camisetas';

  ngOnChanges(): void {
    if (this.initialCategory) {
      this.activeTab = this.initialCategory;
    }
  }

  setTab(tab: 'camisetas' | 'shorts' | 'buzos'): void {
    this.activeTab = tab;
  }

  onClose(): void {
    this.close.emit();
  }
}
