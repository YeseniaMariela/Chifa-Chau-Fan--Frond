import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GenerarqrService {
  private apiUrl = `${environment.miApi}/codigoqr`;

  constructor(
    private http: HttpClient

  ) { }
    
  create(data: any): Observable<any> {
    console.log(this.apiUrl);
    console.log(data);
    return this.http.post(this.apiUrl, data);
  }
}
