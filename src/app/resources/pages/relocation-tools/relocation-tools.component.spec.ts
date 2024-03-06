import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelocationToolsComponent } from './relocation-tools.component';

describe('RelocationToolsComponent', () => {
  let component: RelocationToolsComponent;
  let fixture: ComponentFixture<RelocationToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RelocationToolsComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RelocationToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
