import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Recorrido3dService } from './recorrido3d.service';
import { IRecorrido3D, IResponse } from '../interfaces';

describe('Recorrido3dService', () => {
  let service: Recorrido3dService;
  let httpMock: HttpTestingController;

  const mockRecorrido3D: IRecorrido3D = {
    recorrido3dId: 1,
    nombre: 'Test Recorrido',
    descripcion: 'Descripción de prueba',
    archivoRecorrido: 'archivo.glb',
    fechaCreacion: new Date(),
    propiedad: { propiedadId: 1 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Recorrido3dService]
    });
    service = TestBed.inject(Recorrido3dService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load recorridos3d', () => {
    const mockRecorridos: IRecorrido3D[] = [mockRecorrido3D];
    const mockResponse: IResponse<IRecorrido3D[]> = { data: mockRecorridos };

    service.loadRecorridos3d().subscribe(() => {
      expect(service.recorrido3d$()).toEqual(mockRecorridos);
    });

    const req = httpMock.expectOne(req => req.url === 'recorrido3D' && req.params.has('s'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete a recorrido3d', () => {
    service.deleteRecorrido3dSignal(mockRecorrido3D).subscribe(() => {
      expect(service.recorrido3dRegistrado$()).toBeNull();
    });

    const req = httpMock.expectOne(`recorrido3D/${mockRecorrido3D.recorrido3dId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get recorrido3d by id', () => {
    service.getByIdSignal(1);

    const req = httpMock.expectOne('recorrido3D/propiedad/1');
    expect(req.request.method).toBe('GET');
    req.flush([mockRecorrido3D]);

    expect(service.recorrido3dRegistrado$()).toEqual(mockRecorrido3D);
    expect(service.loadedId$()).toBe(1);
  });
});