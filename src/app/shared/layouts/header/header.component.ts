import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryApiService } from '../../../data-access/api/category-api.service';
import { SubCategoryApiService } from '../../../data-access/api/subcategory-api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private categoryApi = inject(CategoryApiService);
  private subCategoryApi = inject(SubCategoryApiService);

  categories: any[] = [];
  subCategories: any[] = [];
  isMenuOpen: boolean = false;

  ngOnInit(): void {
    this.categoryApi.getCategories(0, 1000).subscribe(res => this.categories = res.content);
    this.subCategoryApi.getSubCategories(0, 1000).subscribe(res => this.subCategories = res.content);
  }

  getCategoryId(name: string): number | null {
    const cat = this.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat ? cat.id : null;
  }

  getSubCategoryId(name: string): number | null {
    const sub = this.subCategories.find(s => s.name.toLowerCase() === name.toLowerCase());
    return sub ? sub.id : null;
  }

  onSearch(event: Event, keyword: string): void {
    event.preventDefault(); // prevent form submit if inside a form
    this.router.navigate(['/'], {
      queryParams: { keyword: keyword || null },
      queryParamsHandling: 'merge'
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
