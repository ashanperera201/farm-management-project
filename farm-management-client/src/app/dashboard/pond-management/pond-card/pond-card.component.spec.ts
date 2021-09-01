import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondCardComponent } from './pond-card.component';

describe('PondCardComponent', () => {
  let component: PondCardComponent;
  let fixture: ComponentFixture<PondCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
