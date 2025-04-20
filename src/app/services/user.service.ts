import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { UserApiService } from './api/users-api.service';
import { ChangePasswordRequest} from '../models/change-password-request.model';
import { UserInfos } from '../models/user-infos.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private userApiService: UserApiService) {}

  // ✅ Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.userApiService.getUsers();
  }

  // ✅ Récupérer un utilisateur par son ID
  getUserById(id: number): Observable<User> {
    return this.userApiService.getUserById(id);
  }

  // ✅ Ajouter un employé
  addUser(user: User): Observable<User> {
    return this.userApiService.addUser(user);
  }

  // ✅ Mettre à jour un utilisateur complet
  updateUser(user: User): Observable<User> {
    return this.userApiService.updateUser(user);
  }

  // ✅ Mettre à jour uniquement le statut d’un utilisateur
  updateUserStatus(user: User): Observable<User> {
    const validStatus = ['actif', 'inactif', 'bloqué', 'en congé'];
    
      if (!validStatus.includes(user.status)) {
        throw new Error(`Status invalide : ${user.status}. Les rôles valides sont : ${validStatus.join(', ')}`);
      }
    return this.userApiService.updateUser(user);
  }

  // ✅ Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.userApiService.deleteUser(id);
  }

  getUsersByRole(role: string): Observable<User[]> {
    const validRoles = ['client', 'employee'];
  
    if (!validRoles.includes(role)) {
      throw new Error(`Rôle invalide : ${role}. Les rôles valides sont : ${validRoles.join(', ')}`);
    }
  
    return this.userApiService.getUsersByRole(role);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.userApiService.getUserByEmail(email);
  }

  changePassword(request : ChangePasswordRequest): Observable<any> {
    return this.userApiService.changePassword(request)
  }

  updateUserInfos(id: number | undefined, userInfos: UserInfos): Observable<string> {
    return this.userApiService.updateUserInfos(id, userInfos);
  }
}
