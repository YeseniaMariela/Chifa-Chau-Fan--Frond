import { TestBed } from '@angular/core/testing';

import { EnvioTokenService } from './envio-token.service';

describe('EnvioTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvioTokenService = TestBed.get(EnvioTokenService);
    expect(service).toBeTruthy();
  });
});
