import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubirImagenService {
  private apiUrl = `${environment.miApi}/upload`;

  constructor(private http: HttpClient) { }
  create(data: any): Observable<any>{
    return this.http.post(this.apiUrl,data);
    }
  
    retornar(): Observable<any>{
      return this.http.get(this.apiUrl);
    }
}
