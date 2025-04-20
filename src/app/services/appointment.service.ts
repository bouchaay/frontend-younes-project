import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { Observable } from 'rxjs';
import { AppointmentApiService } from './api/appointments-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private appointmentApiService: AppointmentApiService) {}

  // ✅ Récupérer tous les rendez-vous
  getAppointments(): Observable<Appointment[]> {
    return this.appointmentApiService.getAppointments();
  }

  // ✅ Récupérer tous les rendez-vous depuis aurjourd'hui
  getAppointmentsFromToday(): Observable<Appointment[]> {
    return this.appointmentApiService.getAppointmentsFromToday();
  }

  // ✅ Récupérer un rendez-vous par ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.appointmentApiService.getAppointmentById(id);
  }

  // ✅ Ajouter un rendez-vous
  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentApiService.addAppointment(appointment);
  }

  // ✅ Mettre à jour un rendez-vous
  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentApiService.updateAppointment(appointment);
  }

  // ✅ Mettre à jour uniquement le statut d’un rendez-vous
  updateAppointmentStatus(id: number, status: string): Observable<Appointment> {
    const validStatuses = ['En attente', 'Confirmé', 'Terminé', 'Annulé'];

    if (!validStatuses.includes(status)) {
      throw new Error(`Statut invalide : ${status}. Les statuts valides sont : ${validStatuses.join(', ')}`);
    }

    return this.appointmentApiService.updateAppointmentStatus(id, status);
  }

  // ✅ Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.appointmentApiService.deleteAppointment(id);
  }

  // ✅ Récupérer les rendez-vous par statut
  getAppointmentsByStatus(status: string): Observable<Appointment[]> {
    const validStatuses = ['En attente', 'Confirmé', 'Terminé', 'Annulé'];

    if (!validStatuses.includes(status)) {
      throw new Error(`Statut invalide : ${status}. Les statuts valides sont : ${validStatuses.join(', ')}`);
    }

    return this.appointmentApiService.getAppointmentsByStatus(status);
  }

  // ✅ Récupérer les rendez-vous par employé
  getAppointmentsByEmployee(employeeName: string): Observable<Appointment[]> {
    return this.appointmentApiService.getAppointmentsByEmployee(employeeName);
  }

  // ✅ Récupérer les rendez-vous par plage de dates
  getAppointmentsByDateRange(startDate: string, endDate: string): Observable<Appointment[]> {
    return this.appointmentApiService.getAppointmentsByDateRange(startDate, endDate);
  }

  // ✅ Récupérer les rendez-vous d'un client spécifique
  getAppointmentsByClient(clientName: string): Observable<Appointment[]> {
    return this.appointmentApiService.getAppointmentsByClient(clientName);
  }
}
