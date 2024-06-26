import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, computed, input
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ClientPopulation } from '~models/client-population';
import { TherapyEnvironment } from '~models/therapy-environment';
import { AvailabilityPipe } from '~shared/availability/availability.pipe';
import { CertificationNamePipe } from '~shared/certification-name/certification-name.pipe';
import { DaysAgoPipe } from '~shared/days-ago/days-ago.pipe';

@Component({
  selector: 'app-connected-candidate-card',
  standalone: true,
  imports: [
    AvailabilityPipe,
    CertificationNamePipe,
    CommonModule,
    DaysAgoPipe,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './connected-candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectedCandidateCardComponent {

  readonly clientPopulations = ClientPopulation;
  readonly therapyEnvironment = TherapyEnvironment;

  candidate = input.required<any>();

  worksFullTime = computed(() => (this.candidate()?.employmentTypes ?? []).includes('full-time'));
  worksPartTime = computed(() => (this.candidate()?.employmentTypes ?? []).includes('part-time'));

  worksInSchools = computed(() => (this.candidate()?.environments ?? []).includes(this.therapyEnvironment.school));
  worksInHome = computed(() => (this.candidate()?.environments ?? []).includes(this.therapyEnvironment.home));
  worksInClinics = computed(() => (this.candidate()?.environments ?? []).includes(this.therapyEnvironment.clinic));
  worksInResidences = computed(() => (this.candidate()?.environments ?? []).includes(this.therapyEnvironment.residence));
  worksInOther = computed(() => (this.candidate()?.environments ?? []).includes(this.therapyEnvironment.other));

  worksWithChildren = computed(() => (this.candidate()?.clientPopulations ?? []).includes(this.clientPopulations.Children));
  worksWithAdolescents = computed(() => (this.candidate()?.clientPopulations ?? []).includes(this.clientPopulations.Adolescents));
  worksWithAdults = computed(() => (this.candidate()?.clientPopulations ?? []).includes(this.clientPopulations.Adults));
  worksWithElderly = computed(() => (this.candidate()?.clientPopulations ?? []).includes(this.clientPopulations.Elderly));
}
