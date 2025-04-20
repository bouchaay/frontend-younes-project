import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Disponibilite } from '../../models/disponibilite.model';

@Injectable({
  providedIn: 'root'
})
export class DisponibiliteApiService {
  private apiUrl = `${environment.apiUrl}/disponibilites`;

  constructor(private http: HttpClient) {}

  // 🔹 Ajouter une disponibilité
  addDisponibilite(dispo: Disponibilite): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(`${this.apiUrl}/add`, dispo);
  }

  // 🔹 Récupérer les disponibilités d'un employé
  getByEmploye(employeId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.apiUrl}/employee/${employeId}`);
  }

  // 🔹 Récupérer les disponibilités d'une date spécifique
  getByDate(date: string): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.apiUrl}/date/${date}`);
  }

  // 🔹 Récupérer les créneaux disponibles d'une date
  getDisponiblesByDate(date: string): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.apiUrl}/available?date=${date}`);
  }

  // ✅ Nouvelle méthode pour envoi multiple
  addMultipleDisponibilites(dispos: Disponibilite[]): Observable<Disponibilite[]> {
    return this.http.post<Disponibilite[]>(`${this.apiUrl}/add-multiple`, dispos);
  }
  
  // 🔹 Supprimer une disponibilité
  deleteDisponibilite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
