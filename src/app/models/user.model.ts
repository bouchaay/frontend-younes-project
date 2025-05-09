export interface User {
  id?: number,
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  status: string;
  createdAt: Date;
  completedAppointments: number;
  canceledAppointments: number;
}