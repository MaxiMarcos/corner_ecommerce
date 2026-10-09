import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Variables for easy modification
  whatsappNumber = '5493515637590'; // Reemplazar con el número final
  instagramUser = 'indumentariacorner';
  year = new Date().getFullYear();

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get instagramUrl(): string {
    return `https://www.instagram.com/${this.instagramUser}/`;
  }
}
