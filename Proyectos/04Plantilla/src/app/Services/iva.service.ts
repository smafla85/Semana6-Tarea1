import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iiva } from '../Interfaces/iiva';

@Injectable({
  providedIn: 'root'
})
export class IvaService {
  apiurl = 'http://localhost:81/sexto/Proyectos/03MVC/controllers/iva.controller.php?op=';

  constructor(private http: HttpClient) {}

  todos(): Observable<Iiva[]> {
    return this.http.get<Iiva[]>(this.apiurl + 'todos');
  }
}