import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AmenidadService } from './amenidad.service';
import { IAmenidad } from '../interfaces';

describe('AmenidadService', () => {
  let service: AmenidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AmenidadService]
    });
    service = TestBed.inject(AmenidadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllSignal', () => {
    it('should update amenidadesList signal with reversed data', () => {
      const dummyAmenidades: IAmenidad[] = [
        { amenidadId: 1, nombre: 'Piscina' },
        { amenidadId: 2, nombre: 'Gimnasio' }
      ];

      service.getAllSignal();

      const req = httpMock.expectOne('amenidades');
      expect(req.request.method).toBe('GET');
      req.flush(dummyAmenidades);

      expect(service.amenidades$()).toEqual(dummyAmenidades.reverse());
    });

    it('should handle errors when fetching amenidades', () => {
      const errorMessage = 'Error fetching amenidades';
      spyOn(console, 'error');

      service.getAllSignal();

      const req = httpMock.expectOne('amenidades');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error', {
        message: errorMessage,
      }));

      expect(console.error).toHaveBeenCalledWith('Error fetching amenidades', jasmine.any(Object));
    });
  });

  describe('amenidades$', () => {
    it('should return the current value of amenidadesList signal', () => {
      const dummyAmenidades: IAmenidad[] = [
        { amenidadId: 1, nombre: 'Piscina' },
        { amenidadId: 2, nombre: 'Gimnasio' }
      ];

      service['amenidadesList'].set(dummyAmenidades);

      expect(service.amenidades$()).toEqual(dummyAmenidades);
    });
  });
});