import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  instaLink = 'https://www.instagram.com/jasmine_beautysalon__';
  facebookLink = 'https://www.facebook.com/profile.php?id=100077742221186&mibextid=wwXIfr&rdid=eBII31vkvLF8xP03&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AQMSTYV1f%2F%3Fmibextid%3DwwXIfr#';
}
