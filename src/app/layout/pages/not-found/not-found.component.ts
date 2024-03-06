import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './not-found.component.html',
  styleUrls: [ './not-found.component.scss' ]
})
export class NotFoundComponent {

}
