import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Variables for easy modification
  whatsappNumber = '5493517614221'; // Reemplazar con el número final
  instagramUser = 'indumentariacorner';
  year = new Date().getFullYear();

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get instagramUrl(): string {
    return `https://www.instagram.com/${this.instagramUser}/`;
  }
}
