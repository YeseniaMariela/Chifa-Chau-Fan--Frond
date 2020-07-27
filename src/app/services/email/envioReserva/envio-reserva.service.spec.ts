import { TestBed } from '@angular/core/testing';

import { EnvioReservaService } from './envio-reserva.service';

describe('EnvioReservaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvioReservaService = TestBed.get(EnvioReservaService);
    expect(service).toBeTruthy();
  });
});
