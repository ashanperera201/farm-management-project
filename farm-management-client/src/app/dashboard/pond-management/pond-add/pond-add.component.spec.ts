import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondAddComponent } from './pond-add.component';

describe('PondAddComponent', () => {
  let component: PondAddComponent;
  let fixture: ComponentFixture<PondAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
