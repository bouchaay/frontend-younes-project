import { Component } from '@angular/core';
import { Service } from '../../models/service.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {

  constructor(private router: Router, private authService: AuthService) {}
  services: Service[] = [
    {
      id: 1,
      name: 'Coupe & Brushing',
      description: 'Une coupe élégante avec un brushing pour un rendu parfait.',
      image: 'assets/images/service1.jpg',
      priceMin: 30,
      priceMax: 50,
      durationMin: 30,
      durationMax: 45
    },
    {
      id: 2,
      name: 'Coloration',
      description: 'Une couleur éclatante et durable adaptée à votre style.',
      image: 'assets/images/service2.jpg',
      priceMin: 60,
      priceMax: 120,
      durationMin: 60,
      durationMax: 90
    },
    {
      id: 3,
      name: 'Soin capillaire',
      description: 'Un soin profond pour nourrir et revitaliser vos cheveux.',
      image: 'assets/images/service3.jpg',
      priceMin: 40,
      priceMax: 70,
      durationMin: 45,
      durationMax: 60
    },
    {
      id: 4,
      name: 'Lissage Brésilien',
      description: 'Des cheveux lisses et soyeux grâce à notre lissage brésilien.',
      image: 'assets/images/service4.jpg',
      priceMin: 80,
      priceMax: 150,
      durationMin: 90,
      durationMax: 120
    },
    {
      id: 5,
      name: 'Balayage',
      description: 'Un balayage naturel et lumineux pour un look frais.',
      image: 'assets/images/service5.jpg',
      priceMin: 70,
      priceMax: 130,
      durationMin: 75,
      durationMax: 105
    },
    {
      id: 6,
      name: 'Extensions capillaires',
      description: 'Ajoutez du volume et de la longueur avec nos extensions premium.',
      image: 'assets/images/service6.jpg',
      priceMin: 100,
      priceMax: 250,
      durationMin: 120,
      durationMax: 180
    },
    {
      id: 7,
      name: 'Permanente',
      description: 'Des boucles parfaites et longue tenue avec notre permanente.',
      image: 'assets/images/service7.jpg',
      priceMin: 50,
      priceMax: 100,
      durationMin: 90,
      durationMax: 120
    },
    {
      id: 8,
      name: 'Barber & Taille de barbe',
      description: 'Un service de coiffure et taille de barbe soigné pour un style impeccable.',
      image: 'assets/images/service8.jpg',
      priceMin: 20,
      priceMax: 40,
      durationMin: 30,
      durationMax: 45
    },
    {
      id: 9,
      name: 'Coiffure événementielle',
      description: 'Des coiffures élégantes pour vos occasions spéciales.',
      image: 'assets/images/service9.jpg',
      priceMin: 50,
      priceMax: 120,
      durationMin: 60,
      durationMax: 90
    }
  ];

  prendreRdv() {
    // vérifier si l'utilisateur est connecté en tant que client
    if (this.authService.getUser()?.role === 'client') {
      this.router.navigateByUrl('/client');
    } else if (this.authService.getUser()?.role === 'employee') {
      alert('Un employé ne peut pas prendre de rendez-vous.');
    } else if (this.authService.getUser()?.role === 'admin') {
      alert('Un administrateur ne peut pas prendre de rendez-vous.');
    } else {
      this.router.navigateByUrl('/login');
      alert('Vous devez être connecté en tant que client pour prendre un rendez-vous.');
    }
  }
}
