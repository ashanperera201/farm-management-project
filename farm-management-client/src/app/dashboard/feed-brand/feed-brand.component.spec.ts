import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBrandComponent } from './feed-brand.component';

describe('FeedBrandComponent', () => {
  let component: FeedBrandComponent;
  let fixture: ComponentFixture<FeedBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
