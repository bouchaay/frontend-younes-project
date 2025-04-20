export interface Disponibilite {
    id?: number;
    date: string;
    heureDebut: string; // HH:mm
    heureFin: string; // HH:mm
    disponible: boolean;
    employeId: number;
    booked : boolean
  }
  