import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDisponibilitesComponent } from './employee-disponibilites.component';

describe('EmployeeDisponibilitesComponent', () => {
  let component: EmployeeDisponibilitesComponent;
  let fixture: ComponentFixture<EmployeeDisponibilitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDisponibilitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDisponibilitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
