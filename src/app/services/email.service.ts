import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendAppointmentEmail(
    toEmail: string,
    toName: string,
    date: string,
    time: string,
    service: string,
    service_en: string,
    status: string,
    status_en: string
  ) {
    const templateParams = {
      to_name: toName,
      email: toEmail,
      appointment_date: date,
      appointment_time: time,
      service_name: service,
      service_name_en: service_en,
      status: status,
      status_en: status_en,
    };

    emailjs
      .send(
        'service_k234gmk', // ✅ Ton service ID
        'template_zobo3ky', // ✅ Ton template ID
        templateParams,
        'VAKORqNqPF314ZSFu' // ✅ Ta clé publique
      )
      .then((result) => {
        console.log('Email envoyé avec succès ! ✅', result.text);
      })
      .catch((error) => {
        console.error('Erreur lors de l’envoi du mail ❌', error);
      });
  }
}
