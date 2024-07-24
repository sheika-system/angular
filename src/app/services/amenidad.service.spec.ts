import { TestBed } from '@angular/core/testing';

import { AmenidadService } from './amenidad.service';

describe('AmenidadService', () => {
  let service: AmenidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmenidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
