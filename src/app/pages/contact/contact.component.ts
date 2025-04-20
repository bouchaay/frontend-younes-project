import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  address: string = "7674 Rue St-Hubert Montréal H1R 2N6, Canada";
  phone: string = "+1 (514) 466 4578";
  email: string = "contact-institut-yy@gmail.com";
  mapSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.049544089126!2d-73.6208583!3d45.5440919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc9193d37426b13%3A0x7bc5450d2ff9ac0e!2s7674%20Rue%20St-Hubert%2C%20Montr%C3%A9al%2C%20QC%20H1R%202N6%2C%20Canada!5e0!3m2!1sfr!2sca!4v1711993312234!5m2!1sfr!2sca";
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
