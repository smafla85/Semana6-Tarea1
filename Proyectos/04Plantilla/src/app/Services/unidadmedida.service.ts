import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUnidadMedida } from '../Interfaces/iunidadmedida';

@Injectable({
  providedIn: 'root'
})
export class UnidadmedidaService {
  private apiUrl = 'http://localhost:81/sexto/Proyectos/03MVC/controllers/unidadmedida.controller.php?op=';

  constructor(private http: HttpClient) { }

  todos(): Observable<IUnidadMedida[]> {
    return this.http.get<IUnidadMedida[]>(`${this.apiUrl}todos`);
  }

  uno(id: number): Observable<IUnidadMedida> {
    const formData = new FormData();
    formData.append('idUnidad', id.toString());
    return this.http.post<IUnidadMedida>(`${this.apiUrl}uno`, formData);
  }

  insertar(unidadMedida: IUnidadMedida): Observable<any> {
    const formData = new FormData();
    formData.append('Descripcion', unidadMedida.Detalle);
    formData.append('Tipo', unidadMedida.Tipo.toString());
    return this.http.post(`${this.apiUrl}insertar`, formData);
  }

  actualizar(unidadMedida: IUnidadMedida): Observable<any> {
    const formData = new FormData();
    formData.append('idUnidad', unidadMedida.idUnidad_Medida.toString());
    formData.append('Descripcion', unidadMedida.Detalle);
    formData.append('Tipo', unidadMedida.Tipo.toString());
    return this.http.post(`${this.apiUrl}actualizar`, formData);
  }

  eliminar(id: number): Observable<any> {
    const formData = new FormData();
    formData.append('idUnidad', id.toString());
    return this.http.post(`${this.apiUrl}eliminar`, formData);
  }
}