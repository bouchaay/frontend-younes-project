import { Component, OnInit } from '@angular/core';
import { DisponibiliteApiService } from '../../../services/api/disponibilite-api.service';
import { Disponibilite } from '../../../models/disponibilite.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-disponibilites',
  templateUrl: './employee-disponibilites.component.html',
  styleUrls: ['./employee-disponibilites.component.scss'],
  standalone: true,
  imports: [DatePipe],
})
export class EmployeeDisponibilitesComponent implements OnInit {
  monday: Date = this.getMonday(new Date());
  weekDays: Date[] = [];
  timeSlots: string[] = [];

  selectedSlots: { [key: string]: boolean } = {};
  bookedSlots: { [key: string]: boolean } = {};

  successMessage: string | null = null;
  errorMessage: string | null = null;

  employeId!: number;
  allWeekSelected: boolean = false;

  constructor(
    private dispoService: DisponibiliteApiService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    if (this.authService.isAuthenticated()) {
      const authUser = this.authService.getUser();
      if (authUser != null) {
        this.userService
          .getUsers()
          .pipe(take(1))
          .subscribe((users) => {
            const matched = users.find((u) => u.email === authUser.email);
            if (matched && matched.id) {
              this.employeId = matched.id;
              this.generateWeekDays();
              this.generateTimeSlots();
              this.loadDisponibilites();
            }
          });
      }
    }
  }

  get friday(): Date {
    this.authService.autoLogoutIfExpired();
    return new Date(this.monday.getTime() + 4 * 24 * 60 * 60 * 1000);
  }

  generateWeekDays(): void {
    this.authService.autoLogoutIfExpired();
    this.weekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(this.monday);
      day.setDate(this.monday.getDate() + i);
      this.weekDays.push(day);
    }
  }

  generateTimeSlots(): void {
    this.authService.autoLogoutIfExpired();
    this.timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      this.timeSlots.push(`${this.pad(hour)}:00`, `${this.pad(hour)}:30`);
    }
  }

  pad(n: number): string {
    this.authService.autoLogoutIfExpired();
    return n < 10 ? '0' + n : '' + n;
  }

  getMonday(date: Date): Date {
    this.authService.autoLogoutIfExpired();
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  previousWeek(): void {
    this.authService.autoLogoutIfExpired();
    const todayMonday = this.getMonday(new Date());
    const previous = new Date(this.monday);
    previous.setDate(this.monday.getDate() - 7);
    const newMonday = this.getMonday(previous);
    if (newMonday < todayMonday) return;

    this.monday = newMonday;
    this.generateWeekDays();
    this.loadDisponibilites();
  }

  nextWeek(): void {
    this.authService.autoLogoutIfExpired();
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7 * 3); // 4 semaines max (cette + 3)

    const next = new Date(this.monday);
    next.setDate(this.monday.getDate() + 7);

    if (this.getMonday(next) > this.getMonday(maxDate)) return;

    this.monday = this.getMonday(next);
    this.generateWeekDays();
    this.loadDisponibilites();
  }

  isSlotAvailable(day: Date, slot: string): boolean {
    this.authService.autoLogoutIfExpired();
    const key = this.getSlotKey(day, slot);
    return !!this.selectedSlots[key];
  }

  isSlotBooked(day: Date, slot: string): boolean {
    this.authService.autoLogoutIfExpired();
    const key = this.getSlotKey(day, slot);
    return !!this.bookedSlots[key];
  }

  isPast(day: Date): boolean {
    this.authService.autoLogoutIfExpired();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  }

  toggleSlot(day: Date, slot: string): void {
    this.authService.autoLogoutIfExpired();
    const key = this.getSlotKey(day, slot);
    if (!this.bookedSlots[key] && !this.isPast(day)) {
      this.selectedSlots[key] = !this.selectedSlots[key];
    }
  }

  getSlotKey(day: Date, time: string): string {
    this.authService.autoLogoutIfExpired();
    const localDate = `${day.getFullYear()}-${this.pad(day.getMonth() + 1)}-${this.pad(day.getDate())}`;
  
    // Si l'heure est au format HH:mm:ss, on la réduit à HH:mm
    const [h, m] = time.split(':');
    const formattedTime = `${this.pad(+h)}:${this.pad(+m)}`;
  
    return `${localDate}_${formattedTime}`;
  }
  

  loadDisponibilites(): void {
    this.authService.autoLogoutIfExpired();
    this.selectedSlots = {};
    this.bookedSlots = {};

    this.dispoService
      .getByEmploye(this.employeId)
      .pipe(take(1))
      .subscribe({
        next: (dispos) => {
          dispos.forEach((d) => {
            const date = new Date(d.date); // transforme en Date si c’est une string
            const key = this.getSlotKey(date, d.heureDebut); // utilise getSlotKey ici
            if (d.disponible) this.selectedSlots[key] = true;
            if (d.booked) this.bookedSlots[key] = true;
          });
        },
        error: () => {
          this.errorMessage =
            '❌ Erreur lors du chargement des disponibilités.';
        },
      });
  }

  selectAllWeek(): void {
    this.authService.autoLogoutIfExpired();
    this.weekDays.forEach((day) => {
      this.timeSlots.forEach((time) => {
        const key = this.getSlotKey(day, time);
        if (!this.isSlotBooked(day, time) && !this.isPast(day)) {
          this.selectedSlots[key] = !this.allWeekSelected;
        }
      });
    });
    this.allWeekSelected = !this.allWeekSelected;
  }

  selectFullDay(day: Date): void {
    this.authService.autoLogoutIfExpired();
    this.timeSlots.forEach((slot) => {
      const key = this.getSlotKey(day, slot);
      if (!this.isSlotBooked(day, slot) && !this.isPast(day)) {
        this.selectedSlots[key] = !this.selectedSlots[key];
      }
    });
  }

  getEndTime(start: string): string {
    this.authService.autoLogoutIfExpired();
    const [h, m] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + 30);
    return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`;
  }

  saveDisponibilites(): void {
    this.authService.autoLogoutIfExpired();
    const payload: Disponibilite[] = [];

    this.weekDays.forEach((day) => {
      if (this.isPast(day)) return;

      this.timeSlots.forEach((slot) => {
        const key = this.getSlotKey(day, slot);

        // ne pas modifier les créneaux réservés
        if (this.bookedSlots[key]) return;

        const [date, heureDebut] = key.split('_');

        payload.push({
          date,
          heureDebut,
          heureFin: this.getEndTime(heureDebut),
          disponible: !!this.selectedSlots[key], // true si coché, false sinon
          employeId: this.employeId,
          booked: false,
        });
      });
    });

    this.dispoService
      .addMultipleDisponibilites(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.successMessage = '✅ Disponibilités enregistrées !';
          this.errorMessage = null;
          this.loadDisponibilites();
        },
        error: () => {
          this.successMessage = null;
          this.errorMessage = '❌ Erreur lors de l’enregistrement.';
        },
      });
  }
}
