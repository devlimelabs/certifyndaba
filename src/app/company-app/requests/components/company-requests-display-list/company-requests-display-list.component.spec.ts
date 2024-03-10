import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRequestsDisplayListComponent } from './company-requests-display-list.component';

describe('CompanyRequestsDisplayListComponent', () => {
  let component: CompanyRequestsDisplayListComponent;
  let fixture: ComponentFixture<CompanyRequestsDisplayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CompanyRequestsDisplayListComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyRequestsDisplayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
