import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Appointment } from '../../../models/appointment.model';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { take } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-admin-appointments',
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.scss'],
  imports: [FormsModule, DatePipe],
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  employees: User[] = [];
  clients: { name: string; email: string }[] = [];
  filteredClients: { name: string; email: string }[] = [];
  clientSearch: string = '';
  clientSearchEmail: string = '';
  showClientDropdown = false;
  isLoading = false;
  errorMessage = '';
  statusFilter: string = 'all';
  employeeFilter: string = 'all';
  startDate: string = '';
  endDate: string = '';
  page: number = 0;
  itemsPerPage: number = 7;
  showAddAppointmentModal = false;
  newAppointment: Appointment = {
    clientName: '',
    clientEmail: '',
    employeeName: '',
    service: '',
    date: new Date(),
    dateCreation: new Date(),
    time: '',
    status: 'En attente',
  };
  editingAppointmentId: number | null | undefined = null;
  editedStatus: string = '';
  appointmentStatuses = ['En attente', 'Confirmé', 'Terminé', 'Annulé'];

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogoutIfExpired();
    this.loadAppointments();
    this.loadEmployees();
    this.loadClients();
  }

  loadAppointments(): void {
    this.authService.autoLogoutIfExpired();
    this.isLoading = true;
    this.appointmentService
      .getAppointments()
      .pipe(take(1))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments.map((a) => ({
            ...a,
            date: new Date(a.date),
            dateCreation: a.dateCreation ? new Date(a.dateCreation) : null,
            dateAnnulation: a.dateAnnulation
              ? new Date(a.dateAnnulation)
              : null,
            dateTerminaison: a.dateTerminaison
              ? new Date(a.dateTerminaison)
              : null,
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des rendez-vous:', err);
          this.errorMessage = 'Impossible de charger les rendez-vous.';
          this.isLoading = false;
        },
      });
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

  loadClients(): void {
    this.authService.autoLogoutIfExpired();
    this.userService
      .getUsersByRole('client')
      .pipe(take(1))
      .subscribe({
        next: (clients) => {
          this.clients = clients.map((c) => ({ name: c.name, email: c.email }));
          this.filteredClients = this.clients;
        },
        error: (err) =>
          console.error('Erreur lors du chargement des clients:', err),
      });
  }

  filterClients(): void {
    this.authService.autoLogoutIfExpired();
    const search = this.clientSearch.toLowerCase().trim();
    this.filteredClients = search
      ? this.clients.filter((c) => c.name.toLowerCase().includes(search))
      : [];
  }

  selectClient(client: { name: string; email: string }): void {
    this.authService.autoLogoutIfExpired();
    this.newAppointment.clientName = client.name;
    this.clientSearch = client.name;
    this.clientSearchEmail = client.email;
    this.showClientDropdown = false;
  }

  get uniqueEmployees(): string[] {
    this.authService.autoLogoutIfExpired();
    return this.employees.map((e) => e.name);
  }

  get filteredAppointments(): Appointment[] {
    this.authService.autoLogoutIfExpired();
    let filtered = this.appointments;

    if (this.employeeFilter !== 'all') {
      filtered = filtered.filter((a) => a.employeeName === this.employeeFilter);
    }
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === this.statusFilter);
    }
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();
      filtered = filtered.filter((a) => {
        const appointmentDate = new Date(a.date).getTime();
        return appointmentDate >= start && appointmentDate <= end;
      });
    }
    return filtered;
  }

  get paginatedAppointments(): Appointment[] {
    this.authService.autoLogoutIfExpired();
    const start = this.page * this.itemsPerPage;
    return this.filteredAppointments.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    this.authService.autoLogoutIfExpired();
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  prevPage(): void {
    this.authService.autoLogoutIfExpired();
    if (this.page > 0) this.page--;
  }

  nextPage(): void {
    this.authService.autoLogoutIfExpired();
    if ((this.page + 1) * this.itemsPerPage < this.filteredAppointments.length)
      this.page++;
  }

  editAppointment(appointment: Appointment): void {
    this.authService.autoLogoutIfExpired();
    this.editingAppointmentId = appointment.id;
    this.editedStatus = appointment.status;
  }

  cancelEdit(): void {
    this.authService.autoLogoutIfExpired();
    this.editingAppointmentId = null;
  }

  saveAppointmentStatus(appointment: Appointment): void {
    this.authService.autoLogoutIfExpired();
    if (!appointment.id) return;
  
    const updatedAppointment = { ...appointment, status: this.editedStatus };
  
    if (this.editedStatus === 'Annulé') {
      updatedAppointment.dateAnnulation = new Date();
    } else if (this.editedStatus === 'Terminé') {
      updatedAppointment.dateTerminaison = new Date();
    }
  
    this.appointmentService.updateAppointment(updatedAppointment).pipe(take(1)).subscribe({
      next: () => {
        this.editingAppointmentId = null;
  
        // ✅ Format date JJ/MM/AAAA
        const formattedDate = formatDate(appointment.date, 'dd/MM/yyyy', 'fr');
  
        // ✅ Traductions pour email bilingue
        const statusEnMap: { [key: string]: string } = {
          'En attente': 'Pending',
          'Confirmé': 'Confirmed',
          'Terminé': 'Completed',
          'Annulé': 'Cancelled',
        };
  
        const serviceEnMap: { [key: string]: string } = {
          'Mise en plis': 'Blow-dry',
          'Coupe': 'Haircut',
          'Coupe & Mise en plis': 'Haircut & Blow-dry',
          'Soin capillaire & Lissage': 'Hair Treatment & Straightening',
          'Botox capillaire': 'Hair Botox',
          'Coloration racine': 'Root Color',
          'Coloration complète': 'Full Hair Color',
          'Toner': 'Toner',
          'Balayage': 'Balayage',
          'Mèches demi-tête': 'Half Head Highlights',
          'Pose de rallonges': 'Hair Extensions',
        };
  
        if (appointment.clientEmail && appointment.clientName && appointment.time && appointment.service) {
          this.emailService.sendAppointmentEmail(
            appointment.clientEmail,
            appointment.clientName,
            formattedDate,
            appointment.time,
            appointment.service,
            serviceEnMap[appointment.service] || appointment.service,
            this.editedStatus,
            statusEnMap[this.editedStatus] || this.editedStatus
          );
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Statut mis à jour',
          showConfirmButton: false,
          timer: 1500,
        });
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour le statut.',
        });
      },
    });
  }

  deleteAppointment(id: number | undefined): void {
    this.authService.autoLogoutIfExpired();
    if (id != undefined) {
      Swal.fire({
        title: 'Supprimer ce rendez-vous ?',
        text: 'Cette action est définitive.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.appointmentService
            .deleteAppointment(id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.loadAppointments();
                Swal.fire({
                  icon: 'success',
                  title: 'Supprimé',
                  text: 'Le rendez-vous a été supprimé.',
                });
              },
              error: (err) => {
                console.error(
                  'Erreur lors de la suppression du rendez-vous:',
                  err
                );
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur',
                  text: 'Impossible de supprimer ce rendez-vous.',
                });
              },
            });
        }
      });
    }
  }

  openAddAppointmentModal(): void {
    this.authService.autoLogoutIfExpired();
    this.showAddAppointmentModal = true;
    this.newAppointment = {
      clientName: '',
      employeeName: '',
      service: '',
      date: new Date(),
      dateCreation: new Date(),
      time: '',
      status: 'En attente',
      clientEmail: '',
    };
    this.clientSearch = '';
    this.filteredClients = this.clients;
    this.showClientDropdown = false;
  }

  closeAddAppointmentModal(): void {
    this.authService.autoLogoutIfExpired();
    this.showAddAppointmentModal = false;
  }

  addAppointment(): void {
    this.authService.autoLogoutIfExpired();
    if (this.newAppointment.clientName && this.newAppointment.service) {
      this.newAppointment.dateCreation = new Date();
      this.newAppointment.clientEmail = this.clientSearchEmail;
      this.appointmentService
        .addAppointment(this.newAppointment)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.closeAddAppointmentModal();
            this.loadAppointments();
            Swal.fire({
              icon: 'success',
              title: 'Rendez-vous ajouté',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (err) => {
            console.error('Erreur lors de l’ajout du rendez-vous:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible d’ajouter le rendez-vous.',
            });
          },
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs du formulaire.',
      });
    }
  }
}
