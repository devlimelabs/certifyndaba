import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationNumberInputComponent } from './certification-number-input.component';

describe('CertificationNumberInputComponent', () => {
  let component: CertificationNumberInputComponent;
  let fixture: ComponentFixture<CertificationNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CertificationNumberInputComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CertificationNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
