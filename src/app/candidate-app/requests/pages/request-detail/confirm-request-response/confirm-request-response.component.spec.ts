import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRequestResponseComponent } from './confirm-request-response.component';

describe('ConfirmRequestResponseComponent', () => {
  let component: ConfirmRequestResponseComponent;
  let fixture: ComponentFixture<ConfirmRequestResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConfirmRequestResponseComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmRequestResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
