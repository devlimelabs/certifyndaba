import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLandingComponent } from './candidate-landing.component';

describe('CandidateLandingComponent', () => {
  let component: CandidateLandingComponent;
  let fixture: ComponentFixture<CandidateLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CandidateLandingComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CandidateLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
