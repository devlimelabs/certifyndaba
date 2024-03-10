import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPlanOptionsComponent } from './company-plan-options.component';

describe('CompanyPlanOptionsComponent', () => {
  let component: CompanyPlanOptionsComponent;
  let fixture: ComponentFixture<CompanyPlanOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CompanyPlanOptionsComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyPlanOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
