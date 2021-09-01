import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBrandListComponent } from './feed-brand-list.component';

describe('FeedBrandListComponent', () => {
  let component: FeedBrandListComponent;
  let fixture: ComponentFixture<FeedBrandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBrandListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
