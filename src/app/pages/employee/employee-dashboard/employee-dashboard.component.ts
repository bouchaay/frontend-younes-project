import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/appointment.model';
import { take } from 'rxjs';
import { AuthService } from '../../../services/auth.service'; // Service pour récupérer l'employé connecté
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  imports: [],
})
export class EmployeeDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  employees: User[] = [];
  clients: User[] = []; // 🔹 Liste des clients chargés depuis le backend

  employeeName: string = '';
  

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    this.loadEmployeeAppointments();
    this.loadEmployees(); // 👈 charge les employés disponibles
    this.loadClients();
  }

  loadEmployees(): void {
    this.authService.autoLogoutIfExpired();
    this.userService
      .getUsersByRole('employee')
      .pipe(take(1))
      .subscribe({
        next: (employees) => (this.employees = employees),
        error: (err) =>
          console.error('Erreur lors du chargement des employés:', err),
      });
  }

  loadClients() {
    this.authService.autoLogoutIfExpired();
    this.userService.getUsersByRole('client').pipe(take(1)).subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('❌ Erreur lors du chargement des clients :', err)
    });
    
  }

  loadEmployeeAppointments() {
    this.authService.autoLogoutIfExpired();
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getUser(); // Récupérer l'utilisateur connecté

      if (!user || !user.email) {
        console.error("❌ L'utilisateur n'est pas disponible !");
        return;
      }

      const userEmail = user.email; // Récupérer l'email du user connecté

      this.userService.getUserByEmail(userEmail).subscribe({
        next: (userData) => {
          if (!userData || !userData.name) {
            console.error("❌ Impossible de récupérer le nom de l'employé !");
            return;
          }

          this.employeeName = userData.name; // Maintenant on a le nom de l'employé

          // Charger les rendez-vous associés à l'employé
          this.appointmentService
            .getAppointmentsByEmployee(this.employeeName)
            .subscribe({
              next: (appointments) => {
                this.appointments = appointments;
              },
              error: (error) => {
                console.error(
                  '❌ Erreur lors du chargement des rendez-vous :',
                  error
                );
              },
            });
        },
        error: (error) => {
          console.error(
            "❌ Erreur lors de la récupération des infos de l'utilisateur :",
            error
          );
        },
      });
    }
  }

  // 🔹 Filtrer les rendez-vous
  get upcomingAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'Confirmé')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  get pendingAppointments() {
    this.authService.autoLogoutIfExpired();
    return this.appointments
      .filter((a) => a.status === 'En attente')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

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

  updateStatus(id: number | undefined, newStatus: string) {
    this.authService.autoLogoutIfExpired();
    if (id != undefined) {
      const appointment = this.appointments.find((a) => a.id === id);
  
      if (!appointment) {
        console.error('❌ Rendez-vous introuvable');
        return;
      }
  
      const updatedAppointment = { ...appointment, status: newStatus };
  
      // Mettre à jour les dates en fonction du statut
      if (newStatus === 'Terminé') {
        updatedAppointment.dateTerminaison = new Date();
      } else if (newStatus === 'Annulé') {
        updatedAppointment.dateAnnulation = new Date();
      }
  
      this.appointmentService
        .updateAppointment(updatedAppointment)
        .pipe(take(1))
        .subscribe({
          next: () => {
            alert(`✅ Statut mis à jour : ${newStatus}`);
            this.loadEmployeeAppointments(); // Recharger les RDV
          },
          error: (error) => {
            console.error('❌ Erreur lors de la mise à jour :', error);
            alert('❌ Impossible de mettre à jour le statut.');
          },
        });
    }
  }
  
  // 🔹 Annuler un rendez-vous (normal ou urgence)
  cancelAppointment(id: number | undefined, isEmergency: boolean) {
    this.authService.autoLogoutIfExpired();
    if (id != undefined) {
      const appointment = this.appointments.find((a) => a.id === id);
  
      if (appointment) {
        const confirmation = confirm(
          isEmergency
            ? `⚠️ Annulation d'urgence du rendez-vous avec ${appointment.clientName}. Confirmer ?`
            : `📅 Annulation du rendez-vous avec ${appointment.clientName}. Confirmer ?`
        );
  
        if (confirmation) {
          const updatedAppointment = {
            ...appointment,
            status: 'Annulé',
            dateAnnulation: new Date(),
          };
  
          this.appointmentService
            .updateAppointment(updatedAppointment)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.loadEmployeeAppointments();
                alert('🚫 Rendez-vous annulé avec succès.');
              },
              error: (err) =>
                console.error(
                  '❌ Erreur lors de l’annulation du rendez-vous :',
                  err
                ),
            });
        }
      }
    }
  }  

  // 🔹 Marquer un rendez-vous comme terminé
  completeAppointment(id: number | undefined) {
    this.authService.autoLogoutIfExpired();
    if (id != undefined) {
      this.updateStatus(id, 'Terminé');
    }
  }
}
