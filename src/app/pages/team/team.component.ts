import { Component } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {

  constructor(private router: Router) { }
  employees: Employee[] = [
    {
      id: 1,
      name: 'Alice Dupont',
      specialties: ['Coloriste', 'Visagiste'],
      image: 'assets/images/employee1.jpg'
    },
    {
      id: 2,
      name: 'Marc Leclerc',
      specialties: ['Coiffeur', 'Expert barbe'],
      image: 'assets/images/employee2.jpg'
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      specialties: ['Styliste', 'Spécialiste soins capillaires'],
      image: 'assets/images/employee3.jpg'
    }
  ];

  navigateToAppointment() {
    this.router.navigate(['/appointment']);
  }
}
