import { TestBed } from '@angular/core/testing';

import { ServiceFinalService } from './service-final.service';

describe('ServiceFinalService', () => {
  let service: ServiceFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
