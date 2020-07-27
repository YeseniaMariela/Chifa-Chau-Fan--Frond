import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarMesasComponent } from './gestionar-mesas.component';

describe('GestionarMesasComponent', () => {
  let component: GestionarMesasComponent;
  let fixture: ComponentFixture<GestionarMesasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarMesasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
