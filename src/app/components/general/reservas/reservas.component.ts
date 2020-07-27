import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, BsDatepickerDirective, ModalDirective } from 'ngx-bootstrap';
import * as Moment from 'moment';
import { CategoriasService } from  'src/app/services/admin/categorias/categorias.service'
import { ProductosService } from 'src/app/services/admin/productos/productos.service';
import { MesasService } from 'src/app/services/admin/mesas/mesas.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservasService } from 'src/app/services/reservas/reservas.service'
import { NgCulqiService } from 'src/app/services/culqi/culqi.service'
@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  @ViewChild('newReservationModal', {static: true}) newReservationModal: ModalDirective;
  @ViewChild('confirmationModal', {static: true}) confirmationModal: ModalDirective;

  @ViewChild('detailModal', {static: true}) detailModal: ModalDirective;
  
  saleDetails = [];
  categoriasProducto: any[];
  productos:any[];
  productosFiltrados:any[]=[];

  bsInlineValue = new Date();
  modalRef: BsModalRef;
  diner: number = 1;
  currentDate: any = Moment().add(1,'days').toDate();
  sale: any = {
    cantidadPersonas: 1
  };
   //validacion logueo
   usuarioLogueado: any;
     // Tab de Detalles
     details: any[] = [
      {
        id: 'politics',
        name: 'politicas',
        selected: true
      },
      {
        id: 'reservation',
        name: 'de la reserva',
        selected: false
      },
      {
        id: 'delivery',
        name: 'del pedido',
        selected: false
      }
    ];
    //Hora Actual
    horaActual:any;

    //Mesas
    mesas:any[];
    mesa: any;
    //Proceso de Reservas
    //Fecha y hora Reserva
    horaReserva:any
    fechaReserva:any
    //Mesaselecionada
    mesaReserva:any
    //mesa seleccionado estilo
    seleccionado:any;
    //detalleProductos -- Productos seleccionados
    private subject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private itemsCarta: any[] = [];
    private valExiste: boolean = false;
    private cantidad: number=0;
    private totalVenta: number=0;

    //Productos a Enviar
    proEnviarPedido: any[]=[]
    datosReserva:any[]=[]
    
    //validacion enviar
    validacionUnProducto:boolean 

    //Email
    mesaEmailReserva:any
    datosEmail: any[]=[];
    fechaFin: any[]=[];
    horaFinPedi:any;
    minFinPedi: any;
    productosEmail: any[] = [];
    //Validacin fecha
    todasReservas:any[]
    soloHoraActual: any = 0;
    soloMinActual: any = 0;
    minPedi: any = 0;
    horaPedi: any = 0;
    fechaHoraPedi: any[]=[];
    fechaHoraActual: any[]=[];
    //Filtro de Reservar
    reservasClientes:any[];
    reservasFiltro: any[] =[];
  constructor(
    private modalService: BsModalService,
    private mesasService:MesasService,
    private categoriasService:CategoriasService,
    private productosService:ProductosService,
    private reservasService:ReservasService,
    private router: Router,
    private clqSrv : NgCulqiService

  ) { 
  //detalleProductos -- Productos seleccionados
    this.subject.subscribe(data => this.itemsCarta = data);
  }

  ngOnInit() {
    this.listarMesas();
    this.horaActual = this.getNowTime();
    
    this.horaReserva = this.horaActual;
    this.fechaReserva = Moment().add(1,'days').toDate();
    
    this.listarProductos();
    this.usuarioLogueado = JSON.parse(localStorage.getItem('DatosUsuarioLogueado'));
    this.listarReservasFiltras()
  }
 
 //******* Modal *******   
  detailSelected: any;
    selectDetail(d: any) {
      if (this.sale.politics === true) {
        this.details.map(i => i.selected = false);
        d.selected = true;
        this.getDetailSelected();
      } else {
        alert('Necesitas aceptar las condiciones para continuar');
      }
    }
  
    getDetailSelected() {
      this.detailSelected = this.details.find(i => i.selected);
    }
  openModal(modal: string) {
    switch (modal) {
      case 'newReservation':
        this.newReservationModal.config.ignoreBackdropClick = true;
        this.getDetailSelected();
        this.newReservationModal.show();
        break;
    
      default:
        break;
    }
  }

  closeModal(modal: string) {
    switch (modal) {
      case 'newReservation':
        this.newReservationModal.hide();
        break;
      case 'confirmation':
        this.confirmationModal.hide();
        break;
      default:
        break;
    }
  }

  togglePerson(type: string) {
    switch (type) {
      case 'minus':
        if (this.sale.cantidadPersonas>1) {
          this.sale.cantidadPersonas -= 1;
        }
        break;
      case 'plus':
        if (this.sale.cantidadPersonas !== 8) {
          this.sale.cantidadPersonas +=1;
        }
      default:
        break;
    }
  }
  goTo(tabName: string) {
    let detailDelivery = this.details.find( i => i.id === tabName);
    if (detailDelivery) {
      console.log(detailDelivery);
      this.selectDetail(detailDelivery);
    }
  }
 //******* Modal *******   

  //Hora
    getNowTime() {
    var fechaActual = new Date();
  var hora = fechaActual.getHours().toString();
  var minutos = fechaActual.getMinutes().toString();
  var segundos = fechaActual.getSeconds().toString();
  if (+minutos < 10){
    minutos = "0" + minutos; 
  }
  if (+hora < 10){
    hora = "0" + hora; 
  }
  
  var Hora = hora + ":" + minutos;
  return Hora
  }
  //metodos
  //******  Listar las mesas - Inicio ******
  listarMesas(){
    this.mesasService.list()
    .subscribe(data => this.mesas = data,
                 err => console.error(err),
                 () => this.listarReservas()
                 );
    ;             
  }
  //******  Listar las mesas - Fin ******
   //******  Listar las Categorias - Inicio ******
   listarCategoriaProducto(){
    this.categoriasService.list()
    .subscribe(data => this.categoriasProducto = data,
                 err => console.error(err),
                 () => this.filtrarProductos(this.categoriasProducto[0].id)
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
   //******  Listar las reservas - Inicio ******
   listarReservas(){
    this.reservasService.list().subscribe(
      data => this.todasReservas = data,
      err => console.log(err),
      () => {
        console.log('todasReservas');

        console.log(this.todasReservas);
        
        for (const pedi of this.todasReservas) {
          if(pedi.fecha !== null || pedi.hora !== null){

              this.fechaHoraPedi = pedi.hora.split(":")
              this.horaPedi = +this.fechaHoraPedi[0];
              this.minPedi = +this.fechaHoraPedi[1];
              this.fechaHoraActual = this.horaReserva.split(":")
              this.soloHoraActual = +this.fechaHoraActual[0];  
              this.soloMinActual = +this.fechaHoraActual[1];                         //Hora                                        min
            if (pedi.fecha ===  Moment(this.fechaReserva).format('YYYY-MM-DD') && ( (this.horaPedi - 1  === this.soloHoraActual &&  this.soloMinActual >= this.minPedi || 
                                                                            this.horaPedi === this.soloHoraActual  &&  this.soloMinActual <= this.minPedi) ||
                                                                            (this.horaPedi  === this.soloHoraActual &&  this.soloMinActual >= this.minPedi || 
                                                                            this.horaPedi + 1 === this.soloHoraActual  &&  this.soloMinActual <= this.minPedi))) {
              for (const mesa of this.mesas) {
                if (mesa.id === pedi.mesaId) {
                  mesa.estado = 'OCUPADO'
                }
              }
            }
            this.fechaHoraPedi = []
              this.horaPedi = 0;
              this.minPedi = 0;
              this.fechaHoraActual = [this.horaReserva.split(":")]
              this.soloHoraActual = 0;
              this.soloMinActual = 0;
        }}

          console.log(this.mesas);
          this.mesaReserva = ""          
      }
    );
  }

  //******  Listar las reservas - Fin ******
   //******  Listar las reservas - Inicio ******
   listarReservasFiltras(){
    this.reservasService.list().subscribe(
      data => this.reservasClientes =data,
      err  => console.log(err),
       ()  => {
        this.reservasFiltro = []
        for (const reservas of this.reservasClientes) {
          if (reservas.clienteId === this.usuarioLogueado.id ) {
            this.reservasFiltro.push(reservas)            
          }
        }
        console.log('flitro ');
        
        console.log(this.reservasFiltro);
        
       }
      )
   }
  //******  Listar las reservas - Fin ******

  //Productos filtro
  filtrarProductos(categoriaId:any){
     this.productos
    this.productosFiltrados = []
    for (const producto of this.productos) {
      if(producto.categoriaId === categoriaId){
        this.productosFiltrados.push(producto)
      }
    }
    
  }


  //detalleProductos -- Productos seleccionados
    addCarta(producto: any) {
      
      this.valExiste = false;
      if (this.itemsCarta.length === 0) {
        this.cantidad =1 
        this.subject.next([...this.itemsCarta, {producto,cantidad:this.cantidad}]);
        this.calcularTotalVenta()

      }
      else{
        for (const cart of this.itemsCarta) {
          if (producto.id === cart['producto'].id) {
            cart['cantidad'] = cart['cantidad'] + 1;
            this.valExiste = true;
            this.calcularTotalVenta()

          }
        }
        if (this.valExiste !== true) {
            this.subject.next([...this.itemsCarta, {producto,cantidad:this.cantidad}]);
            this.calcularTotalVenta()
        }
      }
      console.log(this.itemsCarta);
      
    }

    resCarta(producto: any) {
      let i = 0;
      this.valExiste = false;
        for (const cart of this.itemsCarta) {
          if (producto.id === cart['producto'].id) {
            cart['cantidad'] = cart['cantidad'] - 1;
            this.valExiste = true;
            this.calcularTotalVenta()
            if (cart['cantidad'] === 0) {
              this.eliminarProductoCarrito(i);

            }
          }
          i++;
        }
   

      console.log(this.itemsCarta);
      
    }
    eliminarProductoCarrito(numeroArray:number){
      this.itemsCarta.splice(numeroArray,1);
      this.calcularTotalVenta()

    }
    calcularTotalVenta(){
      this.productosEmail = []
      this.proEnviarPedido=[]
      this.totalVenta =0
      for (const cart of this.itemsCarta) {
        this.totalVenta =  this.totalVenta + (cart['producto'].precioUnidad * cart['cantidad']);
        cart['producto'].cantidad = cart['cantidad'];
        cart['producto'].precio = cart['producto'].precioUnidad * cart['cantidad'];
        this.proEnviarPedido.push(cart['producto']);
        this.productosEmail.push(cart['producto']);
      }
      if (this.itemsCarta !== []) {
        this.validacionUnProducto = true
      } else {
        this.validacionUnProducto = null
      }

      console.log('==============');
      console.log(this.proEnviarPedido);
    }
  //detalleProductos -- Productos seleccionados






  //******  Proceso de Reserva - Inicio ******
  algunosDatos(){
    console.log('hora');
    console.log(this.horaReserva) 
    console.log('Fecha');
    console.log(Moment(this.fechaReserva).format('DD/MM/YYYY'))
    console.log('mesa');
    console.log(this.mesaReserva);
    

  }

  guardarHora(hora:any){
    if(hora <= '09:00'){
      this.horaReserva = '09:00'
      this.horaActual = '09:00'
    } else if (hora >= '09:00' && hora <= '22:00') {
      this.horaReserva = hora
      this.horaActual = hora
    } else if (hora > '22:00') {
      this.horaReserva = '22:00'
      this.horaActual= '22:00'
    }
    console.log(this.horaReserva);
    
  }
  guardarMesa(mesa:any){
    this.mesaReserva = mesa
    console.log(this.mesaReserva);
    
  }
  //validar Datos
  validarFechaHoraMesa(){
    if (this.horaReserva !== undefined &&
        this.fechaReserva !== undefined &&
        this.mesaReserva !== undefined
        ) {
      console.log('Pase Usted'); 
      this.goTo('delivery')     
    } else {
      console.log('NO vales para Programars');
    }
  }

  insertarReserva(){
    var fechaDeRegistroReserva = new Date()
    //Datos Reserva
    this.datosReserva =[]
    this.datosReserva.push(
    { fecha: Moment(this.fechaReserva).format('YYYY/MM/DD'),
      hora: this.horaReserva,
      descuento: 0,
      descripcionDesc: "",
      total: this.totalVenta,
      observaciones: "",
      estado: "RESERVADO",
      numeroPersonas: this.sale.cantidadPersonas,
      mesaId: this.mesaReserva,
      clienteId: this.usuarioLogueado.id,
      productos: this.proEnviarPedido
    })

    
    //Datos Email
    for (const mesa of this.mesas) {
      if(mesa.id === this.mesaReserva){
        this.mesaEmailReserva = mesa.numeroMesa
      }
    }
    
    this.fechaFin = this.horaReserva.split(':');
    this.horaFinPedi = +this.fechaFin[0]            
    this.minFinPedi = this.fechaFin[1]


    this.datosEmail.push({
      name: this.usuarioLogueado.nombre,
      email: this.usuarioLogueado.email,
      fecha: Moment(this.fechaReserva).format('YYYY/MM/DD'),
      horaInicio: this.horaReserva,
      horaFin: ''+ (this.horaFinPedi + 1) + ':' + this.minFinPedi,
      mesa: this.mesaEmailReserva,
      fechaRegistro: fechaDeRegistroReserva.toString(),
      descuento:0,
      total:this.totalVenta,
      subtotal:this.totalVenta,
      productos: this.productosEmail
    });
    console.log('email');
    console.log(this.datosEmail[0]);
    console.log('resrva');
    console.log(this.datosReserva[0]);
    
    this.clqSrv.payorder("Pago de su pedido consumido",this.totalVenta,this.datosReserva[0],this.datosEmail[0]);

    // this.reservasService.create(this.datosReserva[0]).subscribe(
    //   ok => console.log('funciona'),
    //   err => console.log(err)
      
      
    // )
  }
  //******  Proceso de Reserva - Fin ******

  //enviar a
  detallesReserva(id){
    this.router.navigate(['/confirmacionReserva/'+id])
  }


}
