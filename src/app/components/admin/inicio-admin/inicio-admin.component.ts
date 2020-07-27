import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  modalRef: BsModalRef;
  usuarioLogueado: any;

    
    constructor(private modalService: BsModalService,private router: Router,) { }

  ngOnInit() {
    this.usuarioLogueado = JSON.parse(localStorage.getItem('DatosUsuarioLogueado'));
    console.log('usuario');
    
    console.log(this.usuarioLogueado);

  }
  cerrarSesion(){
    localStorage.removeItem('DatosUsuarioLogueado')
    this.usuarioLogueado= ""
    this.router.navigate(['inicio'])
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.config.ignoreBackdropClick = true;
    this.modalRef = this.modalService.show(template);
  }
}
