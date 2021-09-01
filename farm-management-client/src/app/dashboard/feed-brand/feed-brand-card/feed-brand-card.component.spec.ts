import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBrandCardComponent } from './feed-brand-card.component';

describe('FeedBrandCardComponent', () => {
  let component: FeedBrandCardComponent;
  let fixture: ComponentFixture<FeedBrandCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBrandCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBrandCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
