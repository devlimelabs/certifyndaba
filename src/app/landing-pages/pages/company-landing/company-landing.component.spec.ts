import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLandingComponent } from './company-landing.component';

describe('CompanyLandingComponent', () => {
  let component: CompanyLandingComponent;
  let fixture: ComponentFixture<CompanyLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CompanyLandingComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
