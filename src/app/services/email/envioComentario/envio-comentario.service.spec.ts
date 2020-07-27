import { TestBed } from '@angular/core/testing';

import { EnvioComentarioService } from './envio-comentario.service';

describe('EnvioComentarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvioComentarioService = TestBed.get(EnvioComentarioService);
    expect(service).toBeTruthy();
  });
});
