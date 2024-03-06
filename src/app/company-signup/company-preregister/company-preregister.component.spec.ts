import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPreregisterComponent } from './company-preregister.component';

describe('CompanyPreregisterComponent', () => {
  let component: CompanyPreregisterComponent;
  let fixture: ComponentFixture<CompanyPreregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CompanyPreregisterComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyPreregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
