export interface DecodedToken {
    sub: string; // Email de l'utilisateur
    role: string; // Rôle de l'utilisateur (doit être ajouté côté backend)
    exp: number; // Expiration du token
  }