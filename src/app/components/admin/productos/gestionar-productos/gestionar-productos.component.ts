import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { CategoriasService } from  'src/app/services/admin/categorias/categorias.service'
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/services/admin/productos/productos.service';
import { SubirImagenService } from 'src/app/services/subirImagen/subir-imagen.service';

@Component({
  selector: 'app-gestionar-productos',
  templateUrl: './gestionar-productos.component.html',
  styleUrls: ['./gestionar-productos.component.css']
})
export class GestionarProductosComponent implements OnInit {
  //variables
  //******  Listar las Categorias - Inicio ******
  categoriasProducto: any[];
  //Seleccion combobox;
  seleccionDefecto: number;
 
  //******  Listar las Categorias - Fin ******
  //Productos
  productos:any[];
  producto: any;
  //Subida de Imagens a la Nube
  myFile: File;
  imagenProducto = new FormData();
  urlImagen: any;
  //Formulario
  formProducto = new FormGroup({ 
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    precioUnidad: new FormControl(''),
    categoriaId: new FormControl(''),
    imagen: new FormControl(''),
  });
  //Valor disenio
  valor: boolean = null;

  constructor(
    private categoriasService:CategoriasService,
    private productosService:ProductosService,
    private subirImagenService:SubirImagenService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.seleccionDefecto = 0;
    this.listarCategoriaProducto();
    this.listarProductos()
  }

  //metodos
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
                 );
    ;             
  }
  //******  Listar las Productos - Fin ******
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
    .subscribe(dato => this.formProducto.controls['imagen'].setValue(dato),
      err => console.log(err),
      () => this.crearProducto(),
    );
  }
  //subida de Imagen
  crearProducto(){
    console.log(this.formProducto.value);
    this.productosService.create(this.formProducto.value).subscribe(
      (ok) => {
        this.listarProductos();
        this.cancelarEdicion()
        alert('Producto Creado Satisfactoriamente')
      },
        
      (err) => console.log('fallo')
    );
  }

  //******  Agregar las Productos - Fin ******
  //******  Editar las Productos - Inicio ******
  obtenerProductos(id:number){
    this.productosService.get(id).subscribe(
      dato => this.producto = dato,
      err => console.log(err),
      ()=> {
        this.formProducto.controls['nombre'].setValue(this.producto.nombre);
        this.formProducto.controls['descripcion'].setValue(this.producto.descripcion);
        this.formProducto.controls['precioUnidad'].setValue(this.producto.precioUnidad);
        this.formProducto.controls['categoriaId'].setValue(this.producto.categoriaId);
        this.formProducto.controls['imagen'].setValue(this.producto.imagen);
        this.seleccionDefecto = this.producto.categoriaId;
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
        (ok) => this.listarProductos(),
        (err) => this.retornarUrlActulalizar()
      );
    }  
  }
  
  retornarUrlActulalizar(){
    this.subirImagenService.retornar()
    .subscribe(dato => this.formProducto.controls['imagen'].setValue(dato),
      err => console.log(err),
      () => this.actualizarProducto(),
    );
  }

  

  actualizarProducto(){
    this.productosService.update(this.formProducto.value,this.producto.id).subscribe(
      (ok) =>  {
        if (this.valor === null) {
          this.listarProductos()
        } else if (this.valor === true){
          window.location.reload()
        }
      },
      // this.router.navigate(['/admin/categorias']).then(()=> window.location.reload()),
      (err) => console.log('fallo'),
      ()=> {
        this.cancelarEdicion();
        alert('Producto Actualizado Satisfactoriamente')

      }
    )
  }

  cancelarEdicion(){
    this.producto = null;
    this.formProducto.controls['nombre'].setValue("");
        this.formProducto.controls['descripcion'].setValue("");
        this.formProducto.controls['precioUnidad'].setValue("");
        this.seleccionDefecto = 0;
        this.formProducto.controls['imagen'].setValue("");

  }
  //******  Editar las Productos - Fin ******
  //******  Eliminar las Productos - Inicio ******
  eliminarProducto(id:number){
    var opcion = confirm("¿Estas Seguro que deseas eliminar el Producto?");
    if (opcion == true) {
        this.productosService.delete(id)
      .subscribe(
        (ok) => this.listarProductos(),
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
