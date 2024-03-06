import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: [ './contact.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {

}
