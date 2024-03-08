import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDisplayListComponent } from './requests-display-list.component';

describe('RequestsDisplayListComponent', () => {
  let component: RequestsDisplayListComponent;
  let fixture: ComponentFixture<RequestsDisplayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequestsDisplayListComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RequestsDisplayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
