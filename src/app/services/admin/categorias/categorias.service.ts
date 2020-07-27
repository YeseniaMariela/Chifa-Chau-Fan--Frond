import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.miApi}/categorias`;

  constructor(
    private http: HttpClient
  ) { }
  list(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    console.log(this.apiUrl);
    console.log(data);
    return this.http.post(this.apiUrl, data);
  }

  update(data: any,id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`,data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
