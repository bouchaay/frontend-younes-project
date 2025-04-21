import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { WorkingDay } from '../../../models/working-day.model';
import { ClientDashboardService } from './client-dashboard.service';
import { ServiceForAppointment } from '../../../models/service-for-appointment.model';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  imports: [FormsModule, TranslateModule],
})
export class ClientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  allAppointmentsFromToday: Appointment[] = [];
  currentUser!: string; // Remplace par l'utilisateur authentifié
  availableServices!: ServiceForAppointment[];
  employees: { id: number | undefined; name: string }[] = [];
  showAppointmentModal = false;

  newAppointment: Appointment = {
    clientName: '',
    clientEmail: '',
    service: '',
    date: new Date(),
    dateCreation: new Date(),
    time: '',
    status: 'En attente',
    employeeName: '',
  };

  selectedService!: ServiceForAppointment; // Service sélectionné
  selectedDate!: WorkingDay;
  minDate!: string; // Date min = aujourd'hui
  heureMin: string = '';
  heureMax: string = '';
  timeSlots: string[] = [];
  unavailableSlots: string[] = [];
  tooLateSlots: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private authService: AuthService,
    private clientServiceDash: ClientDashboardService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    const now = new Date();
    const hour = now.getHours();

    let minDate = new Date(); // par défaut : aujourd'hui

    // Si on est avant 21h → première date possible = demain
    if (hour < 21) {
      minDate.setDate(minDate.getDate() + 1);
    } else {
      // Si on est après 21h → première date possible = après-demain
      minDate.setDate(minDate.getDate() + 2);
    }

    this.minDate = minDate.toISOString().split('T')[0];

    this.getCurrentUser();
    this.loadAppointments();
    this.loadEmployees();
    this.loadAppointmentsFromToday();
    this.availableServices = this.clientServiceDash.getServicesRdv();
  }

  getCurrentUser() {
    this.authService.autoLogoutIfExpired();
    const user = this.authService.getUser(); // 🔹 Récupérer l'utilisateur depuis AuthService
    if (user) {
      this.currentUser = user.name; // Remplacez par user.name si vous stockez le nom
    } else {
      console.warn('Aucun utilisateur connecté.');
    }
  }

  // ✅ Charger les rendez-vous du client connecté
  loadAppointments() {
    this.authService.autoLogoutIfExpired();
    this.appointmentService
      .getAppointmentsByClient(this.currentUser)
      .pipe(take(1))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des rendez-vous :', err);
        },
      });
  }

  // ✅ Charger les rendez-vous du client connecté
  loadAppointmentsFromToday() {
    this.authService.autoLogoutIfExpired();
    this.appointmentService
      .getAppointmentsByClient(this.currentUser)
      .pipe(take(1))
      .subscribe({
        next: (appointments) => {
          this.allAppointmentsFromToday = appointments;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des rendez-vous :', err);
        },
      });
  }

  // ✅ Charger la liste des employés depuis UserService
  loadEmployees() {
    this.authService.autoLogoutIfExpired();
    this.userService
      .getUsersByRole('employee')
      .pipe(take(1))
      .subscribe({
        next: (employees) => {
          this.employees = employees.map((e) => ({ id: e.id, name: e.name }));
        },
        error: (err) => console.error('Erreur chargement employés:', err),
      });
  }

  // ✅ Rendez-vous à venir
  get upcomingAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'Confirmé')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // ✅ Rendez-vous en attente
  get pendingAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'En attente')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // ✅ Rendez-vous terminés
  get completedAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'Terminé')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get canceledAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'Annulé')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  cancelAppointment(id: number | undefined) {
    this.authService.autoLogoutIfExpired();

    if (id === undefined) return;

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment annuler ce rendez-vous ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        const appointment = this.appointments.find((a) => a.id === id);

        if (!appointment) {
          Swal.fire('Erreur', 'Rendez-vous introuvable.', 'error');
          return;
        }

        const updatedAppointment = { ...appointment, status: 'Annulé' };

        this.appointmentService
          .updateAppointment(updatedAppointment)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.loadAppointments();
              Swal.fire(
                'Annulé',
                '🚫 Rendez-vous annulé avec succès.',
                'success'
              );
            },
            error: (err) => {
              console.error('Erreur lors de l’annulation:', err);
              Swal.fire(
                'Erreur',
                'Une erreur est survenue lors de l’annulation.',
                'error'
              );
            },
          });
      }
    });
  }

  // ✅ Ouvrir le formulaire de prise de rendez-vous
  openAppointmentModal() {
    this.authService.autoLogoutIfExpired();
    this.showAppointmentModal = true;
    this.newAppointment = {
      clientName: this.currentUser,
      service: '',
      date: new Date(),
      dateCreation: new Date(),
      time: '',
      status: 'En attente',
      employeeName: '',
    };
  }

  // ✅ Fermer la modale
  closeAppointmentModal() {
    this.authService.autoLogoutIfExpired();
    this.showAppointmentModal = false;
  }

  // ✅ Prendre un rendez-vous
  bookAppointment() {
    this.authService.autoLogoutIfExpired();
    //if (!this.newAppointment.service || !this.newAppointment.date || !this.newAppointment.time || !this.newAppointment.employeeName) {
    if (
      !this.selectedService ||
      !this.newAppointment.date ||
      !this.newAppointment.time ||
      this.newAppointment.date == new Date('01/01/1999') ||
      this.newAppointment.date < new Date()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.newAppointment.service = this.selectedService.label;
    this.newAppointment.dateCreation = new Date();
    this.newAppointment.clientEmail = this.authService.getUser()?.email;

    this.appointmentService
      .addAppointment(this.newAppointment)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.closeAppointmentModal();
          this.loadAppointments();
          Swal.fire({
            icon: 'success',
            title: 'Réservation réussie',
            text: 'Votre rendez-vous a été réservé avec succès.',
            confirmButtonText: 'OK',
          });
        },
        error: (err) => console.error('Erreur lors de la réservation:', err),
      });
  }

  ajusterHeure(min: string, max: string) {
    this.authService.autoLogoutIfExpired();
    this.heureMin = `${min.padStart(2, '0')}:00`;
    this.heureMax = `${max.padStart(2, '0')}:00`;
  }

  getHeureMinHeureMax(date: Date) {
    this.authService.autoLogoutIfExpired();
    date.getDate() == 2 || 3
      ? this.ajusterHeure('10', '18')
      : date.getDate() == 4 || 5
      ? this.ajusterHeure('10', '19')
      : date.getDate() == 6
      ? this.ajusterHeure('10', '17')
      : this.ajusterHeure('', '');
  }

  onServiceChange(): void {
    this.authService.autoLogoutIfExpired();
    if (this.selectedDate) {
      this.generateTimeSlots(
        this.selectedDate.heureDebut!,
        this.selectedDate.maxHeureFin!
      );
    }
  }

  hasUserSelectedDate = false;

  onDateChange(event: Event): void {
    this.authService.autoLogoutIfExpired();

    if (!this.hasUserSelectedDate) {
      this.hasUserSelectedDate = true;
      return;
    }

    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!value) return;

    const selected = new Date(value);
    const day = selected.getDay();

    if (day === 0 || day === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Erreur',
        text: '❌ Le salon est fermé le dimanche et le lundi.',
        confirmButtonText: 'OK',
      });
      this.newAppointment.date = new Date('01/01/1999');
      this.hasUserSelectedDate = false;
      return;
    }

    this.selectedDate = this.clientServiceDash.getWorkingDays()[day];

    if (!this.selectedDate.workingDay) {
      Swal.fire({
        icon: 'warning',
        title: 'Erreur',
        text: '❌ Le salon est fermé ce jour-là.',
        confirmButtonText: 'OK',
      });
      this.hasUserSelectedDate = false;
      return;
    }

    this.generateTimeSlots(
      this.selectedDate.heureDebut!,
      this.selectedDate.maxHeureFin!
    );
  }

  generateTimeSlots(start: string, end: string): void {
    this.authService.autoLogoutIfExpired();
    this.timeSlots = [];
    this.unavailableSlots = [];
    this.tooLateSlots = [];

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const now = new Date();
    const selectedDate = new Date(this.newAppointment.date);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    // 🔥 Durée du service sélectionné
    const duration = this.selectedService?.duration ?? 30;

    const current = new Date();
    current.setHours(startH, startM || 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(endH, endM || 0, 0, 0);

    while (current < endTime) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      const slot = `${hours}:${minutes}`;

      this.timeSlots.push(slot);

      const slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      const isTooLate = slotEnd > endTime;

      const diffInMin = (current.getTime() - now.getTime()) / (1000 * 60);
      const isTooSoonToday = selectedDateStr === todayStr && diffInMin < 30;

      // 🔒 Ajoute aux créneaux désactivés si le créneau est trop proche ou trop tard
      if (isTooSoonToday) {
        this.unavailableSlots.push(slot);
      }

      if (isTooLate) {
        this.tooLateSlots.push(slot);
      }

      current.setMinutes(current.getMinutes() + 30);
    }
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }

  compareServices(
    s1: ServiceForAppointment,
    s2: ServiceForAppointment
  ): boolean {
    return s1 && s2 ? s1.label === s2.label : s1 === s2;
  }

  getServiceTranslationKey(label: string): string {
    return `SERVICES-DASH.${label}`;
  }
  
}
