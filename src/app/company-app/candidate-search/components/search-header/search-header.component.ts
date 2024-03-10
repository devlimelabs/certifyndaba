import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [ CommonModule, MatMenuModule ],
  templateUrl: './search-header.component.html',
  styleUrls: [ './search-header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchHeaderComponent {

}
