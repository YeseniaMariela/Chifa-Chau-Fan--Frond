import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogueoCilenteGuard implements CanActivate {
//validacion logueo
usuarioLogueado: any;
  
constructor(
  private router: Router,
){
  this.usuarioLogueado = JSON.parse(localStorage.getItem('DatosUsuarioLogueado'));
}
canActivate(){
  if (this.usuarioLogueado) {
      if (this.usuarioLogueado.token === null && this.usuarioLogueado.tipoUsuario === 'CLIENTE'){
        return true            
      }else{
        this.router.navigate(['/inicio'])
        return false; 
      }
  } else{
    this.router.navigate(['/inicio'])
    return false; 

  }
}
  
}
