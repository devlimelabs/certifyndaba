import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input,
  output,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl, FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ValueAccessorDirective } from '~shared/value-accessor/value-accessor.directive';
import { InputConfig, inputConfig } from '../forms';
import { environment } from '~env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PlacesAutocompleteResponse, LocationAutocompleteSuggestion } from './google-places-autocomplete';
import map from 'lodash/map';
@Component({
  selector: 'app-location-search',
  standalone: true,
  hostDirectives: [ ValueAccessorDirective ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './location-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSearchComponent implements OnInit {
  private valueAccessor = inject(ValueAccessorDirective<any>);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);

  inputConfig = input<InputConfig>();
  latLng = output<{ latitude: number; longitude: number;}>();
  places = signal<any[]>([]);

  config = computed(() => inputConfig(this.inputConfig()));

  inputCtrl = new FormControl();

  async ngOnInit() {
    if (this.inputConfig()?.validators) {
      this.inputCtrl.setValidators(this.inputConfig()?.validators ?? []);
    }

    this.valueAccessor.value
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value !== this.inputCtrl.value) {
          this.inputCtrl.patchValue(value ?? null);
        }
      });

    this.inputCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(query => this.search(query));
  }

  async search(query: string): Promise<void> {
    // console.log('event', event);
    // const query = event?.target?.value ?? '';

    if (query.length > 0) {
      try {
        const places = await this.autocompleteSearch(query);
        console.log('formatted places', places);
        this.places.set(places);

        return;
      } catch (error) {
        console.error('Error searching for places:', error);
      }
    }

    this.places.set([]);
  }

  async selectPlace(place: any): Promise<any> {
    console.log('Selected place:', place);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Goog-Api-Key', environment.firebase.apiKey);

    const params = {
      fields: '*'
    };

    const placeDetails = await firstValueFrom(this.http.get<any>(`https://places.googleapis.com/v1/places/${place.placeId}`, {
      headers,
      params
    }));

    this.updateValue(placeDetails.formattedAddress);

    this.latLng.emit(placeDetails.location);
  }

  updateValue(value: any): void {
    this.valueAccessor.valueChange(value);

    this.valueAccessor.touchedChange(true);
  }

  async autocompleteSearch(input: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Goog-Api-Key', environment.firebase.apiKey);

    const suggestions = await firstValueFrom(this.http.post<any>(`https://places.googleapis.com/v1/places:autocomplete`, { input }, { headers }));

    console.log('suggestions', suggestions);
    return this.transformSuggestions(suggestions);
  }

  transformSuggestions(data: PlacesAutocompleteResponse): LocationAutocompleteSuggestion[] {
    return map(data.suggestions, suggestion => {
      const placePrediction = suggestion.placePrediction;
      return {
        placeId: placePrediction?.placeId,
        text: placePrediction?.text?.text,
        mainText: placePrediction?.structuredFormat?.mainText?.text,
        secondaryText: placePrediction?.structuredFormat?.secondaryText?.text
      };
    });
  }
}

