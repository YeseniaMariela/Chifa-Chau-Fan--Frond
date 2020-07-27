import { TestBed, async, inject } from '@angular/core/testing';

import { LogueoGuard } from './logueo.guard';

describe('LogueoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogueoGuard]
    });
  });

  it('should ...', inject([LogueoGuard], (guard: LogueoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
