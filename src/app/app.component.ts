import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { FooterComponent } from './shared/layouts/footer/footer.component';

// Declare gtag globally
declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CartComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'corner-ecommerce';
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'G-6381597110', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
