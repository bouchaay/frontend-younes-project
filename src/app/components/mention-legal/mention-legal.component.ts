import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mention-legal',
  imports: [TranslateModule],
  templateUrl: './mention-legal.component.html',
  styleUrl: './mention-legal.component.scss'
})
export class MentionLegalComponent {

  email = 'institutyy0@gmail.com';

}
