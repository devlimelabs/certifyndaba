import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurvaluesComponent } from './ourvalues.component';

describe('OurvaluesComponent', () => {
  let component: OurvaluesComponent;
  let fixture: ComponentFixture<OurvaluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OurvaluesComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OurvaluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
