export interface Appointment {
    id?: number;
    clientName?: string;
    clientEmail? : string;
    employeeName?: string;
    service: string;
    date: Date;  // ✅ Permet null
    time?: string;
    dateCreation: Date | null; // ✅ Permet null
    dateAnnulation?: Date | null;
    dateTerminaison?: Date | null;
    status: string;
}
