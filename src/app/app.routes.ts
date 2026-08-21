import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/catalog/pages/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent)
  },
  {
    path: 'product/:id',
    // We will create this component later
    loadComponent: () => import('./features/product-detail/pages/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent).catch(() => import('./features/catalog/pages/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent))
  },
  {
    path: '**',
    redirectTo: ''
  }
];
