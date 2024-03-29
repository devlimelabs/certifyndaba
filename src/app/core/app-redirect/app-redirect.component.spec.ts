import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRedirectComponent } from './app-redirect.component';

describe('AppRedirectComponent', () => {
  let component: AppRedirectComponent;
  let fixture: ComponentFixture<AppRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AppRedirectComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
