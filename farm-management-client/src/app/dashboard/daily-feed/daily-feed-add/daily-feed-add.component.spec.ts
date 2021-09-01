import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFeedAddComponent } from './daily-feed-add.component';

describe('DailyFeedAddComponent', () => {
  let component: DailyFeedAddComponent;
  let fixture: ComponentFixture<DailyFeedAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyFeedAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyFeedAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
