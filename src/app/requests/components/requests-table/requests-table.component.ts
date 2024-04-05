import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, input, signal, viewChild
} from '@angular/core';
import { Request } from '~models/request';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StartCasePipe } from "~shared/start-case/start-case.pipe";
import { pick, some } from 'lodash';
import { RouterLink } from '@angular/router';
import { SanitizePipe } from '~shared/sanitize.pipe';
@Component({
  selector: 'app-requests-table',
  standalone: true,
  templateUrl: `./requests-table.component.html`,
  styleUrl: './requests-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    SanitizePipe,
    StartCasePipe
  ]
})
export class RequestsTableComponent implements OnInit, AfterViewInit {

  private cdr = inject(ChangeDetectorRef);

  requests = input<any[]>([]);

  sort = viewChild(MatSort);

  columns: string[] = [
    'title',
    'salary',
    'status'
  ];

  displayedColumns: string[] = [
    'title',
    'description',
    'createdAt',
    'salary',
    'status'
  ];

  dataSource!: MatTableDataSource<Request>;

  showFilter = signal(false);

  ngOnInit() {
    this.dataSource = new MatTableDataSource([ ...this.requests() ]);

    this.dataSource.filterPredicate = (request, query) => {
      const queries = query.split(' ');
      const value = Object.values(pick(request, this.displayedColumns)).join(' ')
        .toLowerCase();
      return some(queries, query => value.includes(query));
    };

    this.cdr.markForCheck();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort() ?? null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.cdr.markForCheck();
  }

  toggleFilter(): void {
    this.dataSource.filter = '';
    this.showFilter.update(showFilter => !showFilter);
  }

}
