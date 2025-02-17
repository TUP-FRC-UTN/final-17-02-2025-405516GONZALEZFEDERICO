import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardFinalGuard } from './guard-final.guard';

describe('guardFinalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardFinalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
