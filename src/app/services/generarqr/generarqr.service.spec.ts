import { TestBed } from '@angular/core/testing';

import { GenerarqrService } from './generarqr.service';

describe('GenerarqrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerarqrService = TestBed.get(GenerarqrService);
    expect(service).toBeTruthy();
  });
});
