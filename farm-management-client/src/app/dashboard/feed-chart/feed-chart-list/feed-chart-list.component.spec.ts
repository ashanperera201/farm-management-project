import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedChartListComponent } from './feed-chart-list.component';

describe('FeedChartListComponent', () => {
  let component: FeedChartListComponent;
  let fixture: ComponentFixture<FeedChartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedChartListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
