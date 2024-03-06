import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanySignupComponent } from 'src/app/company-signup/company-signup.component';

import { Feature, FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { MissonComponent } from '../../components/misson/misson.component';
import { OurvaluesComponent } from '../../components/ourvalues/ourvalues.component';
import { CompanyPreregisterComponent } from 'src/app/company-signup/company-preregister/company-preregister.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CompanyPreregisterComponent,
    CompanySignupComponent,
    HeroComponent,
    FeaturesComponent,
    MissonComponent,
    OurvaluesComponent
  ],
  templateUrl: './company-landing.component.html',
  styleUrls: [ './company-landing.component.scss' ]
})
export class CompanyLandingComponent {
  features: Feature[] = [
    {
      title: 'Access',
      text: ' Gain access to a vast network of credentialed individuals, both actively seeking opportunities and those who may be open to new possibilities. Confidentially engage with candidates and spark their interest in your organization.',
      icon: 'admin_panel_settings'
    },
    {
      title: 'Verification',
      text: 'Rest assured that the professionals on our platform are thoroughly vetted and verified, ensuring that your interactions are focused on qualified and credible candidates.',
      icon: 'connect_without_contact'
    },
    {
      title: 'Efficiency',
      text: 'With Certifynd, connecting with professionals who match your clinic\'s requirements is just a few clicks away. Our platform streamlines your search, enabling you to reach out to the right candidates within moments.',
      icon: 'verified_user'
    }
  ];
}
