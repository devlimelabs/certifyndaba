import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissonComponent } from './misson.component';

describe('MissonComponent', () => {
  let component: MissonComponent;
  let fixture: ComponentFixture<MissonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MissonComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
