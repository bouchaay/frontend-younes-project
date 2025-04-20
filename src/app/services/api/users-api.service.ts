import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { ChangePasswordRequest } from '../../models/change-password-request.model';
import { UserInfo } from 'os';
import { UserInfos } from '../../models/user-infos.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiUrl = `${environment.apiUrl}/users`; // URL du backend

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les utilisateurs depuis /all
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  // 🔹 Récupérer un utilisateur par ID depuis /id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Ajouter un employé depuis /add
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, user);
  }

  // 🔹 Mettre à jour un utilisateur complet depuis /update/id
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${user.id}`, user);
  }

  // 🔹 Mettre à jour le statut d'un utilisateur depuis /update/id/status
  updateUserStatus(id: number, user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/update/${id}/status`, user.status);
  }

  // 🔹 Supprimer un utilisateur depuis /delete/id
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // 🔹 Récupérer les utilisateurs en fonction de leur rôle (client/employé) depuis role/role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.post(`${this.apiUrl}/change-password`, request, {
      responseType: 'text' as 'json'
    });
  }

  updateUserInfos(id: number | undefined, userInfos: UserInfos): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update-info/${id}`, userInfos, {
      responseType: 'text' as 'json'
    });
  }
}
