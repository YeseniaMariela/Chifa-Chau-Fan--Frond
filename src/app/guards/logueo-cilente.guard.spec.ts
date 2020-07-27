import { TestBed, async, inject } from '@angular/core/testing';

import { LogueoCilenteGuard } from './logueo-cilente.guard';

describe('LogueoCilenteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogueoCilenteGuard]
    });
  });

  it('should ...', inject([LogueoCilenteGuard], (guard: LogueoCilenteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
