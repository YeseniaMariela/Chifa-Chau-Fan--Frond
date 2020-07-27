import { Component, OnInit } from '@angular/core';
//importamos el servicio Categorias
import { FormGroup, FormControl } from '@angular/forms';
import { CategoriasService } from  'src/app/services/admin/categorias/categorias.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gestionar-categorias',
  templateUrl: './gestionar-categorias.component.html',
  styleUrls: ['./gestionar-categorias.component.css']
})
export class GestionarCategoriasComponent implements OnInit {
  //variables
  //******  Listar las Categorias - Inicio ******
  categoriasProducto: any[];
  //******  Listar las Categorias - Fin ******
  categoriaForm = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
  });
  //******  Actualizar las Categorias - Inicio ******
  categoria: any;
  //******  Actualizar las Categorias - Fin ******

  constructor(
    private categoriasService:CategoriasService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listarCategoriaProducto();
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

  //******  crear las Categorias - Inicio ******
  crearCategoria(){
    console.log(this.categoriaForm.value);
    this.categoriasService.create(this.categoriaForm.value).subscribe(
      (ok) => console.log(ok),
      //  this.router.navigate(['/categoriasProducto']).
      // then(()=> window.location.reload()),
      (err) => console.log('fallo'),
      ()=> {
        //limpiar
        this.categoria = null;
        this.categoriaForm.controls['nombre'].setValue("");
        this.categoriaForm.controls['descripcion'].setValue("");
        this.listarCategoriaProducto()
        alert('Categoria Creada Satisfactoriamente')
      }
    );
  }
  //******  crear las Categorias - Fin ******

  //******  Actualizar las Categorias - Inicio ******
  obtenerCategoria(id:number){
    this.categoriasService.get(id).subscribe(
      dato => this.categoria = dato,
      err => console.log(err),
      ()=> {
        this.categoriaForm.controls['nombre'].setValue(this.categoria.nombre);
        this.categoriaForm.controls['descripcion'].setValue(this.categoria.descripcion);
  }
      
    );
  }
  actulizarCategoria(){
    this.categoriasService.update(this.categoriaForm.value,this.categoria.id).subscribe(
      (ok) => this.listarCategoriaProducto(),
      // this.router.navigate(['/admin/categorias']).then(()=> window.location.reload()),
      (err) => console.log('fallo'),
      ()=> {this.cancelarEdicion()
        alert('Categoria Actualizada Satisfactoriamente')
      }
    )
  }

  cancelarEdicion(){
    this.categoria = null;
    this.categoriaForm.controls['nombre'].setValue("");
    this.categoriaForm.controls['descripcion'].setValue("");

  }
  //******  Actualizar las Categorias - Fin ******

  //******  Eliminar las Categorias - Inicio ******
  eliminarCargo(id:number){
    var opcion = confirm("¿Estas Seguro que deseas eliminar la categoria?");
    if (opcion == true) {
      this.categoriasService.delete(id).subscribe(
        (ok)=> this.listarCategoriaProducto(),
        (err) => console.log('fallo'),
        
      )    
	  } else {
      
	  }
  }
  //******  Eliminar las Categorias - Fin ******

}
