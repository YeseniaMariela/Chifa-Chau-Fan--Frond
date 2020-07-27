import { TestBed } from '@angular/core/testing';

import { SubirImagenService } from './subir-imagen.service';

describe('SubirImagenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubirImagenService = TestBed.get(SubirImagenService);
    expect(service).toBeTruthy();
  });
});
