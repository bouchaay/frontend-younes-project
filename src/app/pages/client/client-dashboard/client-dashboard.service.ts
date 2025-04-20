import { Injectable } from '@angular/core';
import { ServiceForAppointment } from '../../../models/service-for-appointment.model';
import { WorkingDay } from '../../../models/working-day.model';

@Injectable({
  providedIn: 'root',
})
export class ClientDashboardService {
  // Les services disponibles pour la prise de rendez-vous
  servicesRdv: ServiceForAppointment[] = [
    {
      id: 1,
      type: 'Coiffure & Coupe',
      label: 'Mise en plis',
      duration: 60,
    },
    {
      id: 2,
      type: 'Coiffure & Coupe',
      label: 'Coupe',
      duration: 30,
    },
    {
      id: 3,
      type: 'Coiffure & Coupe',
      label: 'Coupe & Mise en plis',
      duration: 90,
    },
    {
      id: 4,
      type: 'Soins & Lissage',
      label: 'Soin capillaire & Lissage',
      duration: 240,
    },
    {
      id: 5,
      type: 'Soins & Lissage',
      label: 'Botox capillaire',
      duration: 150,
    },
    {
      id: 6,
      type: 'Coloration',
      label: 'Coloration racine',
      duration: 45,
    },
    {
      id: 7,
      type: 'Coloration',
      label: 'Coloration complète',
      duration: 90,
    },
    {
      id: 8,
      type: 'Coloration',
      label: 'Toner',
      duration: 30,
    },
    {
      id: 9,
      type: 'Mèches & Balayage',
      label: 'Balayage',
      duration: 240,
    },
    {
      id: 10,
      type: 'Mèches & Balayage',
      label: 'Mèches demi-tête',
      duration: 165,
    },
    {
      id: 11,
      type: 'Rallonges',
      label: 'Pose de rallonges',
      duration: 120,
    },
  ];

  // Les jours de travail de l'institut
  dimanche: WorkingDay = {
    id: 0,
    label: 'dimanche',
    workingDay: false,
  };
  lundi: WorkingDay = {
    id: 1,
    label: 'lundi',
    workingDay: false,
  };
  mardi: WorkingDay = {
    id: 2,
    label: 'mardi',
    workingDay: true,
    heureDebut: '10',
    heureFin: '18',
    maxHeureFin: '19',
  };
  mercredi: WorkingDay = {
    id: 3,
    label: 'mercredi',
    workingDay: true,
    heureDebut: '10',
    heureFin: '18',
    maxHeureFin: '19',
  };
  jeudi: WorkingDay = {
    id: 4,
    label: 'jeudi',
    workingDay: true,
    heureDebut: '10',
    heureFin: '19',
    maxHeureFin: '20',
  };
  vendredi: WorkingDay = {
    id: 5,
    label: 'vendredi',
    workingDay: true,
    heureDebut: '10',
    heureFin: '19',
    maxHeureFin: '20',
  };
  samedi: WorkingDay = {
    id: 6,
    label: 'samedi',
    workingDay: true,
    heureDebut: '10',
    heureFin: '17',
    maxHeureFin: '18',
  };

  public getServicesRdv(): ServiceForAppointment[] {
    return this.servicesRdv;
  }

  public getWorkingDays(): WorkingDay[] {
    return [
      this.dimanche,
      this.lundi,
      this.mardi,
      this.mercredi,
      this.jeudi,
      this.vendredi,
      this.samedi,
    ];
  }
}
