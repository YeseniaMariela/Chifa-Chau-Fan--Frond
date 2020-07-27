import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, BsDatepickerDirective, ModalDirective } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservasService } from 'src/app/services/reservas/reservas.service'
import { MesasService } from 'src/app/services/admin/mesas/mesas.service';
import { ProductosService } from 'src/app/services/admin/productos/productos.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
import { log } from 'util';

@Component({
  selector: 'app-gestionar-reservas',
  templateUrl: './gestionar-reservas.component.html',
  styleUrls: ['./gestionar-reservas.component.css']
})
export class GestionarReservasComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  @ViewChild('newReservationModal', {static: true}) newReservationModal: ModalDirective;
  @ViewChild('confirmationModal', {static: true}) confirmationModal: ModalDirective;

  @ViewChild('detailModal', {static: true}) detailModal: ModalDirective;
  bsInlineValue = new Date();
  modalRef: BsModalRef;
  diner: number = 1;
  currentDate: any = Moment().toDate();
  //Fechas
  fechaInicio:any;
  fechaFin:any;
  //reservas
  precioTotalReservas: any
  reservas: any[];
  reserva: any;
  detallesProductosReserva:any[]
  filtroReservas: any[]=[];
  //usuarios
  usuarios:any[];
  //Productos
  productos:any[];
  //Mesas
  mesas:any[];

  constructor(
    private reservasService: ReservasService,
    private mesasService:MesasService,
    private productosService:ProductosService,
    private usuariosService:UsuariosService,
    private modalService: BsModalService,
    

  ) { }

  ngOnInit() {
    this.fechaInicio = Moment().toDate();
    this.fechaFin = Moment().toDate();
    this.listarReportes()
    this.listarUsuarios()
    this.listarProductos()
    this.listarMesas();

  }

  
  listarReportes(){
    this.reservasService.list().subscribe(
      data => {this.reservas = data;
      },
      err => console.log(err),
      () => {
        this.precioTotalReservas = 0
        this.filtroReservas = []
        for (const reserva of this.reservas) {
          if(Moment(this.fechaInicio).format('YYYY-MM-DD') <= reserva.fecha
          && Moment(this.fechaFin).format('YYYY-MM-DD') >= reserva.fecha ){
            this.filtroReservas.push(reserva);
            this.precioTotalReservas = this.precioTotalReservas + reserva.total

          }
        }

      }
      
      
    )
  }

  buscarFecha(){
    this.listarReportes()

  }
  //******  Listar las Usuarios - Inicio ******
  listarUsuarios(){
    this.usuariosService.list()
    .subscribe(data => this.usuarios = data,
                 err => console.error(err),
                 ()=>console.log(this.usuarios)
                 
                 );
    ;             
  }
  //******  Listar las Usuarios - Fin ******
    //******  Listar las Productos - Inicio ******
    listarProductos(){
      this.productosService.list()
      .subscribe(data => this.productos = data,
                   err => console.error(err),
                   );
      ;             
    }
  //******  Listar las Productos - Fin ******
  //******  Listar las Mesas - Inicio ******
  listarMesas(){
    this.mesasService.list()
    .subscribe(data => this.mesas = data,
                 err => console.error(err),
                 );
    ;             
  }
  //Actualizar Estado
  cambiarEstadoReserva(reservaId){
    this.reserva = null
    this.reservasService.get(reservaId).subscribe(
      data => {this.reserva = data
        this.reserva.estado= "ATENDIDO"
      },
      err => console.log(err),
      () =>  this.reservasService.update(this.reserva,reservaId).subscribe(
        ok => console.log(ok),
        err => console.log(err),
        ()=> this.listarReportes()
  
      )
    )
   
  }
  //******  Listar las Mesas - Fin ******
  //Modal
  openModal(template: TemplateRef<any>,reservaId: any) {
    this.modalService.config.ignoreBackdropClick = true;
    this.modalRef = this.modalService.show(template);
    this.detallesReserva(reservaId);
  }

  detallesReserva(reservaId: any){
    console.log('-----------------');
    console.log(reservaId);
    console.log('-----------------');
    this.reservasService.get(reservaId).subscribe(
      data => {this.reserva = data
        this.detallesProductosReserva = []
        this.detallesProductosReserva =this.reserva.ventaDetalle
        console.log(this.reserva);
        console.log(this.detallesProductosReserva);
      },
      err => console.log(err),

    )
  }
  closeModal() {
    this.modalRef.hide();
    
  }
}
