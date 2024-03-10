import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRequestsListComponent } from './company-requests-list.component';

describe('CompanyRequestsListComponent', () => {
  let component: CompanyRequestsListComponent;
  let fixture: ComponentFixture<CompanyRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CompanyRequestsListComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
