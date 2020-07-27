import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { ReservasService } from 'src/app/services/reservas/reservas.service'
import { ProductosService } from 'src/app/services/admin/productos/productos.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoriasService } from  'src/app/services/admin/categorias/categorias.service'
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  usuarios:any[]
  categoriasProducto: any[];
  productos:any[];
  //Fecha por la cual buscar
  proFechaInicio: any;
  proFechaFin: any;
  cliFechaInicio: any;
  cliFechaFin: any;
  //Listar Reservas
  reservas: any[]
  reservasDetalles: any[]
  filtroReservas:any[]
  //para los Productos
  busquedaProductos:any[]
  filtroDetallesBusqueda:any[]
  productosOrdenados: any[]
  clientesOrdenados: any[]
  datosTopPro:any[]
  index:number = 1
  //
  topProductos:any[]	
  cantidadVentaClie = 1
  indexCli:number = 1
  topClie:any[]	
  datosTopClie:any[]
  //detalleProductos -- Productos Mas vedidos
  private subject: BehaviorSubject<any[]> = new BehaviorSubject([]);

  private subject2: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private itemsCarta: any[] = [];
  private valExiste: boolean = false;
  private itemsClintes: any[] = [];


  constructor(
    private reservasService: ReservasService,
    private productosService:ProductosService,
    private usuariosService:UsuariosService,
    private categoriasService:CategoriasService,
    ) { 
      //detalleProductos -- Productos seleccionados
    this.subject.subscribe(data => this.itemsCarta = data);
    this.subject2.subscribe(data => this.itemsClintes = data);
  
    }

  ngOnInit() {
    this.listarReportes()
    this.listarCategoriaProducto()
    this.listarProductos()
    this.listarUsuarios()
  }
  listarReportes(){
    this.reservasService.list().subscribe(
      data => {this.reservas = data;
      },
      err => console.log(err),
      () => {
        this.ListarReservasDetalles()
    });
  }
  ListarReservasDetalles(){
    this.reservasService.listDetalles().subscribe(
      data => {this.reservasDetalles = data;
      },
      err => console.log(err),
     
    );
  }
//******  Listar las Categorias - Inicio ******
listarCategoriaProducto(){
  this.categoriasService.list()
  .subscribe(data => this.categoriasProducto = data,
               err => console.error(err),
               );
  ;             
}
//******  Listar las Categorias - Fin ******
 //******  Listar las Productos - Inicio ******
 listarProductos(){
  this.productosService.list()
  .subscribe(data => this.productos = data,
               err => console.error(err),
               ()=> this.listarCategoriaProducto()
               );
  ;             
}
//******  Listar las Productos - Fin ******
   //******  Listar las Usuarios - Inicio ******
   listarUsuarios(){
    this.usuariosService.list()
    .subscribe(data => this.usuarios = data,
                 err => console.error(err),                 
                 );
    ;             
  }
  //******  Listar las Usuarios - Fin ******


  ListarProductosMasVendidos(){
    this.filtroReservas = []
    for (const reserva of this.reservas) {
      if(Moment(this.proFechaInicio).format('YYYY-MM-DD') <= reserva.fecha
      && Moment(this.proFechaFin).format('YYYY-MM-DD') >= reserva.fecha ){
        this.filtroReservas.push(reserva)
      }
    }
    console.log(this.filtroReservas);
    this.busquedaProductos = []
    this.filtroDetallesBusqueda = []
    for (const fiReseva of this.filtroReservas) {
      for (const reDetalle of this.reservasDetalles) {
        if(fiReseva.id === reDetalle.ventaId){
          this.filtroDetallesBusqueda.push(reDetalle)
        }
      }
    }
    console.log('productops usqueasaq');
    console.log(this.filtroDetallesBusqueda);
    this.itemsCarta = []

    for (const filtroDetalle of this.filtroDetallesBusqueda) {
      this.valExiste = false;
      
      if (this.itemsCarta.length === 0) {
        this.subject.next([...this.itemsCarta, {producto:filtroDetalle.productoId,cantidad:filtroDetalle.cantidad}]);

      }
      else{
        for (const cart of this.itemsCarta) {
          if (filtroDetalle.productoId === cart['producto']) {
            cart['cantidad'] = cart['cantidad'] + filtroDetalle.cantidad;
            this.valExiste = true;

          }
        }
        if (this.valExiste !== true) {
            this.subject.next([...this.itemsCarta, {producto:filtroDetalle.productoId,cantidad:filtroDetalle.cantidad}]);
        }
      }
    }

      console.log('Productos Resume');
      console.log(this.itemsCarta);
      console.log('Ordeandos');
      this.productosOrdenados = this.itemsCarta.sort(function (a, b) {
        return (b.cantidad - a.cantidad)
      });
      console.log(this.productosOrdenados);
      this.index = 1
      this.topProductos=[]	

      for (const proOrdendos of this.productosOrdenados) {
        if(this.index <=10){
          this.topProductos.push(proOrdendos)
        }
        this.index++
      }
      console.log('Top');
      console.log(this.topProductos);
      this.datosTopPro=[]

      for (const tPro of this.topProductos) {
        for (const p of this.productos) {
          if (p.id === tPro.producto) {
            for (const cat of this.categoriasProducto) {
              if(cat.id === p.categoriaId){
                this.datosTopPro.push({producto:p,
                  categoria:cat.nombre,
                  cantidad:tPro.cantidad})
              }
            }
          }
        }
      }
      console.log('TopCli');
      console.log(this.datosTopPro);
      
      
      
  }
 listarTopClientes(){
  this.filtroReservas = []
  for (const reserva of this.reservas) {
    if(Moment(this.cliFechaInicio).format('YYYY-MM-DD') <= reserva.fecha
    && Moment(this.cliFechaFin).format('YYYY-MM-DD') >= reserva.fecha ){
      this.filtroReservas.push(reserva)
    }
  }
  this.itemsClintes =  []
  for (const fireservas of this.filtroReservas) {
    this.valExiste = false;
    this.cantidadVentaClie = 1
    if (this.itemsClintes.length === 0) {
      this.subject2.next([...this.itemsClintes, {cliente:fireservas.clienteId,monto:fireservas.total,cantidadVenta: this.cantidadVentaClie }]);

    }
    else{
      for (const cart of this.itemsClintes) {
        if (fireservas.clienteId === cart['cliente']) {
          cart['monto'] = cart['monto'] + fireservas.total;
          cart['cantidadVenta'] = cart['cantidadVenta'] + 1;
          this.valExiste = true;

        }
      }
      if (this.valExiste !== true) {
          this.subject2.next([...this.itemsClintes, {cliente:fireservas.clienteId,monto:fireservas.total,cantidadVenta: this.cantidadVentaClie}]);
      }
    }
  }
  console.log('clientes');
  console.log(this.itemsClintes);
  this.clientesOrdenados = this.itemsClintes.sort(function (a, b) {
    return (b.monto - a.monto)
  });
  console.log(this.clientesOrdenados);
  
  this.indexCli = 1
  this.topClie=[]	

  for (const cliOrdendos of this.clientesOrdenados) {
    if(this.indexCli <=10){
      this.topClie.push(cliOrdendos)
    }
    this.indexCli++
  }
  console.log('TopCli');
  console.log(this.topClie);
  this.datosTopClie = []
  
  for (const tCli of this.topClie) {
    for (const usu of this.usuarios) {
      if (usu.id === tCli.cliente) {
        this.datosTopClie.push({cliente:usu,
          cantidadVenta:tCli.cantidadVenta,
          monto:tCli.monto})
      }
    }
  }
  console.log('TopCli');
  console.log(this.datosTopClie);
  

  }

  pdfTopProductos(){
    const doc = new jsPDF('p', 'pt', 'letter');
    const margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    };
    doc.fromHTML(document.getElementById('topProductos'), 
                margins.left, margins.top
                , {}, function () {
      //  doc.output('export.pdf'); ** REMOVE **
        doc.save("ListaTopProductos.pdf");
      }, margins);
    
  }
  pdfTopClientes(){
    const doc = new jsPDF('p', 'pt', 'letter');
    const margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    };
    doc.fromHTML(document.getElementById('topClientes'), 
                margins.left, margins.top
                , {}, function () {
      //  doc.output('export.pdf'); ** REMOVE **
        doc.save("ListaTopClientes.pdf");
      }, margins);

  }
}