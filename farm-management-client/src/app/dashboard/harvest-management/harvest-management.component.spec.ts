import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestManagementComponent } from './harvest-management.component';

describe('HarvestManagementComponent', () => {
  let component: HarvestManagementComponent;
  let fixture: ComponentFixture<HarvestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
