import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output 
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { showHideVertical } from 'src/app/animations/show-hide-vertical';


export interface FilterCategory {
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './filter-panel.component.html',
  styleUrls: [ './filter-panel.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ showHideVertical() ]
})
export class FilterPanelComponent {

  @Input() filterCategory!: FilterCategory;

  @Output() filterUpdate = new EventEmitter<string[]>();

  query = '';

  show = true;

  filter(optionIndex: number) {
    this.filterCategory.options[optionIndex].checked = !this.filterCategory.options[optionIndex].checked;

    const values = map(filter(this.filterCategory.options, { checked: true }), 'value');

    console.log('values', values);
    this.filterUpdate.emit(values);
  }

  toggleDisplay(): void {
    this.show = !this.show;
  }
}
