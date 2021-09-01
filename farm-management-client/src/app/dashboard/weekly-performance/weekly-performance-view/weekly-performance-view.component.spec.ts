import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPerformanceViewComponent } from './weekly-performance-view.component';

describe('WeeklyPerformanceViewComponent', () => {
  let component: WeeklyPerformanceViewComponent;
  let fixture: ComponentFixture<WeeklyPerformanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyPerformanceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPerformanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
