import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PuntoInteresService } from './punto-interes.service';
import { IPuntoInteres, IResponse } from '../interfaces';

describe('PuntoInteresService', () => {
  let service: PuntoInteresService;
  let httpMock: HttpTestingController;

  const mockPuntoInteres: IPuntoInteres = {
    puntoInteresId: 1,
    nombre: 'Punto de interés de prueba',
    posicionX: 10,
    posicionY: 20,
    recorrido3dId: 1,
    escenaId: 'scene0'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PuntoInteresService]
    });
    service = TestBed.inject(PuntoInteresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get puntos de interés by recorrido3d', () => {
    const mockPuntos: IPuntoInteres[] = [mockPuntoInteres];

    service.getPuntoInteresByRecorrido3d(1);

    const req = httpMock.expectOne('puntointeres/recorrido3D/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPuntos);

    expect(service.puntoInteresList$()).toEqual(mockPuntos);
  });

  it('should get puntos de interés by recorrido and escena', () => {
    const mockPuntos: IPuntoInteres[] = [mockPuntoInteres];

    service.getPuntoInteresByRecorridoAndEscena(1, 'escena1');

    const req = httpMock.expectOne('puntointeres/recorrido3D/1/escena/escena1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPuntos);

    expect(service.puntoInteresList$()).toEqual(mockPuntos);
  });

  it('should save a punto de interés', () => {
    service.savePuntoInteresSignal(mockPuntoInteres).subscribe(response => {
      expect(response).toEqual(mockPuntoInteres);
      expect(service.puntoInteresList$()[0]).toEqual(mockPuntoInteres);
    });

    const req = httpMock.expectOne('puntointeres');
    expect(req.request.method).toBe('POST');
    req.flush(mockPuntoInteres);
  });

  it('should delete a punto de interés', () => {
    // Primero, simulamos que hay un punto de interés en la lista
    service.getPuntoInteresByRecorrido3d(1);
    const getReq = httpMock.expectOne('puntointeres/recorrido3D/1');
    getReq.flush([mockPuntoInteres]);

    // Verificamos que el punto de interés está en la lista
    expect(service.puntoInteresList$()).toEqual([mockPuntoInteres]);

    // Ahora procedemos con la eliminación
    service.deletePuntoInteres(mockPuntoInteres).subscribe(() => {
      // Después de la eliminación, la lista debería estar vacía
      expect(service.puntoInteresList$()).toEqual([]);
    });

    const deleteReq = httpMock.expectOne(`puntointeres/${mockPuntoInteres.puntoInteresId}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});
  });
});