import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChangePasswordComponent } from './client-change-password.component';

describe('ClientChangePasswordComponent', () => {
  let component: ClientChangePasswordComponent;
  let fixture: ComponentFixture<ClientChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientChangePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
