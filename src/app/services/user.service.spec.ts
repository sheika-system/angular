import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service'; // Asegúrate de importar tu servicio
import { IUser } from '../interfaces';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    const mockUser: IUser = {
        id: 1,
        nombre: 'John',
        apellido: 'Doe',
        email: 'john.doe@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const updatedUser: IUser = {
        ...mockUser,
        nombre: 'Jane'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should update a user and update the userListSignal', (done) => {
        // Configuramos el estado inicial del userListSignal
        const initialUsers: IUser[] = [mockUser];
        service.userListSignal.set(initialUsers);

        // Llamamos al método para actualizar un usuario
        service.updateUserSignal(updatedUser).subscribe(response => {
            // Verificamos que la llamada HTTP es correcta
            const req = httpMock.expectOne(`users/${updatedUser.id}`);
            expect(req.request.method).toBe('PUT');
            req.flush(updatedUser); // Simulamos la respuesta del servidor
            
            // Esperamos un ciclo de detección de cambios para que la señal se actualice
            setTimeout(() => {
                const users = service.userListSignal(); // Accedemos al valor actual del signal
                expect(users).toEqual([updatedUser]); // Esperamos que la lista de usuarios tenga el usuario actualizado
                done();
            }, 0);
        }, error => {
            fail('Expected successful response, but got error: ' + error);
        });

        // Simulamos la llamada HTTP
        const req = httpMock.expectOne(`users/${updatedUser.id}`);
        expect(req.request.method).toBe('PUT');
        req.flush(updatedUser);
    });
});
