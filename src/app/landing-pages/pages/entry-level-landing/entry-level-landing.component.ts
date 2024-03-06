import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { MissonComponent } from '../../components/misson/misson.component';
import { OurvaluesComponent } from '../../components/ourvalues/ourvalues.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    MissonComponent,
    OurvaluesComponent
  ],
  templateUrl: './entry-level-landing.component.html',
  styleUrls: [ './entry-level-landing.component.scss' ]
})
export class EntryLevelLandingComponent {
  features = [];

}
