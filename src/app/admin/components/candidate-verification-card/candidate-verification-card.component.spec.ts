import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVerificationCardComponent } from './candidate-verification-card.component';

describe('CandidateVerificationCardComponent', () => {
  let component: CandidateVerificationCardComponent;
  let fixture: ComponentFixture<CandidateVerificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CandidateVerificationCardComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CandidateVerificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
