import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);

  onSearch(event: Event, keyword: string): void {
    event.preventDefault(); // prevent form submit if inside a form
    this.router.navigate(['/'], {
      queryParams: { keyword: keyword || null },
      queryParamsHandling: 'merge'
    });
  }
}
