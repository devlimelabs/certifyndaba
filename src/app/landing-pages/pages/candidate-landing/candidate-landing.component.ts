import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { Feature, FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { MissonComponent } from '../../components/misson/misson.component';
import { OurvaluesComponent } from '../../components/ourvalues/ourvalues.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    HeroComponent,
    FeaturesComponent,
    MissonComponent,
    OurvaluesComponent,
    RouterLink
  ],
  templateUrl: './candidate-landing.component.html',
  styleUrls: [ './candidate-landing.component.scss' ]
})
export class CandidateLandingComponent {

  private router = inject(Router);

  features: Feature[] = [
    {
      title: 'Privacy',
      text: 'We protect your personal information throughout the entire process of finding a new opportunity. We keep your personal information private until you decide to share it with them.',
      icon: 'admin_panel_settings'
    },
    {
      title: 'Transparency',
      text: 'Any request to connect with you from an employer will include salary, location, & other specifics up front before you ever lift a finger or talk to anyone.',
      icon: 'connect_without_contact'
    },
    {
      title: 'Control',
      text: 'The people behind our platform have years of industry leading experience in finding the best therapists. This best-in-class reputation has allowed us to put the ball into your court when it comes to finding new opportunities.',
      icon: 'verified_user'
    }
  ];


  async signup() {
    this.router.navigateByUrl(`/sign-in?redirect=/app/candidate/profile`);
  }
}
