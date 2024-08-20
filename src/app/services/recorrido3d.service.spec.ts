import { TestBed } from '@angular/core/testing';

import { Recorrido3dService } from './recorrido3d.service';

describe('Recorrido3dService', () => {
  let service: Recorrido3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recorrido3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
