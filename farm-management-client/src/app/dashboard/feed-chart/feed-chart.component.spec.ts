import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedChartComponent } from './feed-chart.component';

describe('FeedChartComponent', () => {
  let component: FeedChartComponent;
  let fixture: ComponentFixture<FeedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
