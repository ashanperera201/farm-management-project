import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBrandAddComponent } from './feed-brand-add.component';

describe('FeedBrandAddComponent', () => {
  let component: FeedBrandAddComponent;
  let fixture: ComponentFixture<FeedBrandAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBrandAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBrandAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
