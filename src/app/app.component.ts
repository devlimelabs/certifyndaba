import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckForUpdateService } from './core/check-for-update/check-for-update.service';
import { PromptUpdateService } from './core/prompt-update/prompt-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private checkUpdateSvc = inject(CheckForUpdateService);
  private promptUpdateSvc = inject(PromptUpdateService);
}
