import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EnvioComentarioService } from 'src/app/services/email/envioComentario/envio-comentario.service'
@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent implements OnInit {
  formContacto = new FormGroup({ 
    nombre: new FormControl(''),
    email: new FormControl(''),
    celular: new FormControl(''),
    mensaje: new FormControl(''),
  });
  constructor(
    private router:Router,
    private envioComentarioService:EnvioComentarioService
  ) { }

  ngOnInit() {
  }
  enviarComentario(){
    this.envioComentarioService.create(this.formContacto.value).subscribe(
      ok => console.log('mensaje enviado'),
      err=> console.log(err),
      () => this.router.navigate(['/inicio'])
      
    )
  }
}
