import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubViewWidgetComponent } from './club-view-widget.component';

describe('ClubViewWidgetComponent', () => {
  let component: ClubViewWidgetComponent;
  let fixture: ComponentFixture<ClubViewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubViewWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubViewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
