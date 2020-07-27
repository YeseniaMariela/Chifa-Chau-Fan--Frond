import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubirImagenService } from 'src/app/services/subirImagen/subir-imagen.service';
import { MesasService } from 'src/app/services/admin/mesas/mesas.service';

@Component({
  selector: 'app-gestionar-mesas',
  templateUrl: './gestionar-mesas.component.html',
  styleUrls: ['./gestionar-mesas.component.css']
})
export class GestionarMesasComponent implements OnInit {
  //Productos
  mesas:any[];
  mesa: any;
  //Subida de Imagens a la Nube
  myFile: File;
  imagenProducto = new FormData();
  urlImagen: any;
  //Formulario
  formMesa = new FormGroup({ 
    numeroMesa: new FormControl(''),
    capacidad: new FormControl(''),
    estado: new FormControl(''),
    imagen: new FormControl(''),
  });
  //Valor disenio
  valor: boolean = null;
  constructor(
    private mesasService:MesasService,
    private subirImagenService:SubirImagenService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.listarMesas();
  }
//metodos
  //******  Listar las Categorias - Inicio ******
  listarMesas(){
    this.mesasService.list()
    .subscribe(data => this.mesas = data,
                 err => console.error(err),
                 );
    ;             
  }
  //******  Listar las Categorias - Fin ******
  
  //******  Agregar las Productos - Inicio ******
  //subida de Imagen
  onFileChange(event) {
    this.myFile = event.target.files[0];
  }
  subirImagen(){
    this.urlImagen='';
    this.imagenProducto.append('image',this.myFile);
    console.log(this.imagenProducto);
    console.log('nada pe');
    
    this.subirImagenService.create(this.imagenProducto).subscribe(
      (ok) => this.router.navigate(['/productosAdmin']).
      then(()=> window.location.reload()),
      (err) => this.retornarUrl()
    );
  }

  retornarUrl(){
    this.subirImagenService.retornar()
    .subscribe(dato => this.formMesa.controls['imagen'].setValue(dato),
      err => console.log(err),
      () => this.crearProducto(),
    );
  }
  //subida de Imagen
  crearProducto(){
    console.log(this.formMesa.value);
    this.mesasService.create(this.formMesa.value).subscribe(
      (ok) => {
        this.listarMesas();
        alert('Mesa Creada Satisfactoriamente')

        // this.cancelarEdicion()
      },
      (err) => console.log('fallo')
    );
  }

  //******  Agregar las Productos - Fin ******
  //******  Editar las Mesas - Inicio ******
  obtenerMesa(id:number){
    this.mesasService.get(id).subscribe(
      dato => this.mesa = dato,
      err => console.log(err),
      ()=> {
        console.log(this.mesa);
        
        this.formMesa.controls['numeroMesa'].setValue(this.mesa.numeroMesa);
        this.formMesa.controls['capacidad'].setValue(this.mesa.capacidad);
        this.formMesa.controls['estado'].setValue(this.mesa.estado);
        this.formMesa.controls['imagen'].setValue(this.mesa.imagen);
        this.valor = null
  }
      
    );
  }

  onFileChangeV(event) {
    this.myFile = event.target.files[0];
  }
  
  subirImagenActualizar(){
    //Editar Solo Datos Sin Imagen del Producto
    if (this.valor === null) {
      this.actualizarProducto();
    }else if (this.valor === true) {
    //Editar Imagen y datos del Producto 
      this.urlImagen='';
      this.imagenProducto.append('image',this.myFile);
      console.log(this.imagenProducto);
      this.subirImagenService.create(this.imagenProducto).subscribe(
        (ok) => this.listarMesas(),
        (err) => this.retornarUrlActulalizar()
      );
    }  
  }
  
  retornarUrlActulalizar(){
    this.subirImagenService.retornar()
    .subscribe(dato => this.formMesa.controls['imagen'].setValue(dato),
      err => console.log(err),
      () => this.actualizarProducto(),
    );
  }

  

  actualizarProducto(){
    this.mesasService.update(this.formMesa.value,this.mesa.id).subscribe(
      (ok) =>  {
        if (this.valor === null) {
          this.listarMesas()
        } else if (this.valor === true){
          window.location.reload()
        }
      },
      // this.router.navigate(['/admin/categorias']).then(()=> window.location.reload()),
      (err) => console.log('fallo'),
      ()=> {
        this.cancelarEdicion();
        alert('Mesa Actualizada Satisfactoriamente')

      }
    )
  }

  cancelarEdicion(){
    this.mesa = null;
    this.formMesa.controls['numeroMesa'].setValue("");
        this.formMesa.controls['capacidad'].setValue("");
        this.formMesa.controls['estado'].setValue("");
        this.formMesa.controls['imagen'].setValue("");
  }
  //******  Editar las Mesas - Fin ******
    //******  Eliminar las Productos - Inicio ******
    eliminarProducto(id:number){
      var opcion = confirm("¿Estas Seguro que deseas eliminar la mesa?");
      if (opcion == true) {
        this.mesasService.delete(id)
      .subscribe(
        (ok) => this.listarMesas(),
        (err) => console.log('fallo'), 
      );
      }
    }
    //******  Eliminar las Productos - Fin ******
  
    
    
    
    
    //estilos
    cambiarValor(){
      if (this.valor === null) {
        this.valor = true;
        console.log(this.valor);
      }else if (this.valor === true) {
        this.valor = null;
        console.log(this.valor);
      }      
    }
}
