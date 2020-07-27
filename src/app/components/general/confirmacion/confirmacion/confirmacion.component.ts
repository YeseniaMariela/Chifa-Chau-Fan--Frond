import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/services/admin/productos/productos.service';
import { MesasService } from 'src/app/services/admin/mesas/mesas.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service'

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  reserva: any;
  // usuario Logueo
  usuarioLogueado: any;
  productos:any
  //detallesProductosReserva
  productosReserva:any[]
  //mesas
  mesas:any[]
  //fecha fin
  fechaFin: any[]=[];
    horaFinPedi:any;
    minFinPedi: any;
    horaFinal
  constructor(
    private router:Router,
    private productosService:ProductosService,
    private mesasService:MesasService,
    private reservasService:ReservasService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.usuarioLogueado = JSON.parse(localStorage.getItem('DatosUsuarioLogueado'));
    const id = this.route.snapshot.paramMap.get('id');
    this.listarProductos(+id)
    
  
  }
  listaReserva(id:number){
    this.reservasService.get(id).subscribe(
      data => this.reserva =data,
      err => console.log(err),
      ()=> {
        this.listarMesas()
        this.productosReserva=[]
        this.fechaFin = this.reserva.venta.hora.split(':');
        this.horaFinPedi = +this.fechaFin[0]            
        this.minFinPedi = this.fechaFin[1]
        this.horaFinal= ''+ (this.horaFinPedi + 1) + ':' + this.minFinPedi,

        console.log(this.reserva)
       this.productosReserva = this.reserva.ventaDetalle
       console.log(this.productosReserva);
       
      }
    )
  }
     //******  Listar las Productos - Inicio ******
     listarProductos(id:number){
      this.productosService.list()
      .subscribe(data => this.productos = data,
                   err => console.error(err),
                   () => this.listaReserva(id)
                   );
      ;             
    }
    //******  Listar las Productos - Fin ******
      //******  Listar las mesas - Inicio ******
  listarMesas(){
    this.mesasService.list()
    .subscribe(data => this.mesas = data,
                 err => console.error(err),
                 );
    ;             
  }
  //******  Listar las mesas - Fin ******
  close(){
    this.router.navigate(['/reservas'])
  }
}
