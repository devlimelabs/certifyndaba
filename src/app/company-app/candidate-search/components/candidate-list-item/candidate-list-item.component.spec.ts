import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateListItemComponent } from './candidate-list-item.component';

describe('CandidateListItemComponent', () => {
  let component: CandidateListItemComponent;
  let fixture: ComponentFixture<CandidateListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CandidateListItemComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CandidateListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
