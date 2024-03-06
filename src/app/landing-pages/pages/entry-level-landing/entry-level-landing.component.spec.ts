import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryLevelLandingComponent } from './entry-level-landing.component';

describe('EntryLevelLandingComponent', () => {
  let component: EntryLevelLandingComponent;
  let fixture: ComponentFixture<EntryLevelLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EntryLevelLandingComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntryLevelLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
