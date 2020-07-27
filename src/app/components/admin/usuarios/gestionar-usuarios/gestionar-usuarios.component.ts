import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
@Component({
  selector: 'app-gestionar-usuarios',
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.css']
})
export class GestionarUsuariosComponent implements OnInit {
  //Usuarios
  usuarios:any[];
  usuario: any;
  generoUsuario:string = "MASCULINO";
  emailExiste:boolean
  UsuarioExiste:boolean;
  CorreoExiste:boolean;
  // Disenio
  mostrar:any
  //Formulario
  formUsuario = new FormGroup({ 
    apellidos: new FormControl(''),
    nombre: new FormControl(''),
    genero: new FormControl(''),
    tipoUsuario: new FormControl(''),
    email: new FormControl(''),
    numCelular: new FormControl(''),
    usuario: new FormControl(''),
    contrasenia: new FormControl(''),
  });
  
  constructor(
    private usuariosService:UsuariosService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.listarUsuarios()
    
  }
//metodos
  //******  Listar las Usuarios - Inicio ******
  listarUsuarios(){
    this.usuariosService.list()
    .subscribe(data => this.usuarios = data,
                 err => console.error(err),
                 ()=>console.log('ok')
                 
                 );
    ;             
  }
  //******  Listar las Usuarios - Fin ******
  //******  Agregar las Usuarios - Inicio ******
  //ObtenerGenero
  obtenerGenero(genero: string){
    this.generoUsuario = genero;
  }

  crearUsuario(){
    if (this.emailExiste === null && this.UsuarioExiste === null && this.formUsuario.value !== null) {
      this.formUsuario.controls['genero'].setValue(this.generoUsuario)
      console.log(this.formUsuario.value);
      this.usuariosService.create(this.formUsuario.value).subscribe(
        (ok) => {
          this.listarUsuarios();
          this.cancelarEdicion()
          alert('Usuario Creado Satisfactoriamente')

        },
        (err) => console.log('fallo')
      );
    } else {
      console.log('No se puede registrar');
      
    }
  }

  //******  Agregar las Productos - Fin ******
//******  Actualizar las Productos - Inicio ******
obtenerUsuario(id:number){
  this.usuariosService.get(id).subscribe(
    dato => this.usuario = dato,
    err => console.log(err),
    ()=> {
      console.log(this.usuario);
      this.formUsuario.controls['apellidos'].setValue(this.usuario.apellidos);
      this.formUsuario.controls['nombre'].setValue(this.usuario.nombre);
      this.formUsuario.controls['genero'].setValue(this.usuario.genero);
      this.formUsuario.controls['email'].setValue(this.usuario.email);
      this.formUsuario.controls['tipoUsuario'].setValue(this.usuario.tipoUsuario);
      this.formUsuario.controls['numCelular'].setValue(this.usuario.numCelular);
      this.formUsuario.controls['usuario'].setValue(this.usuario.usuario);
      this.formUsuario.controls['contrasenia'].setValue(this.usuario.contrasenia);
      this.generoUsuario=this.usuario.genero
}
    
  );
}
actualizarUsuario(){
  var yaExisteUsuario: boolean = false;
  var yaExisteCorreo: boolean = false;

  this.formUsuario.controls['genero'].setValue(this.generoUsuario)
  console.log(this.formUsuario.controls['email'].value);
  
  for (const usuario of this.usuarios) {
    if (usuario.id !== this.usuario.id) { 
      if (usuario.usuario === this.formUsuario.controls['usuario'].value) {
        yaExisteUsuario = true;
      }
      if (usuario.email === this.formUsuario.controls['email'].value) {
        yaExisteCorreo = true
      }
    }
  }

  if (yaExisteUsuario === true ) {
    console.log('No se Ha podido actuazliar el usuario porque ya existe');
    this.UsuarioExiste = true;

  } else if (yaExisteCorreo === true){
    console.log('No se Ha podido actuazliar el usuario porque ya existe');
    this.CorreoExiste = true
  }
  else if (yaExisteUsuario === false && yaExisteCorreo === false ){
    this.UsuarioExiste = null;
    this.CorreoExiste = null

    this.usuariosService.update(this.formUsuario.value,this.usuario.id).subscribe(
      (ok) => this.listarUsuarios(),
      // this.router.navigate(['/admin/categorias']).then(()=> window.location.reload()),
      (err) => console.log('fallo'),
      ()=> {this.cancelarEdicion()
        alert('Usuario Actualizado Satisfactoriamente')
      }
    )
    console.log('Se actualizo con exito');
  }
}

cancelarEdicion(){
  this.usuario = null;
  this.formUsuario.controls['apellidos'].setValue("");
      this.formUsuario.controls['nombre'].setValue("");
      this.formUsuario.controls['genero'].setValue("");
      this.formUsuario.controls['email'].setValue("");
      this.formUsuario.controls['tipoUsuario'].setValue(""); 
      this.formUsuario.controls['numCelular'].setValue("");
      this.formUsuario.controls['usuario'].setValue("");
      this.formUsuario.controls['contrasenia'].setValue("");
      this.generoUsuario='MASCULINO'

  }
  //******  Actualizar las Productos - Fin ******
  //******  Eliminar las Categorias - Inicio ******
  eliminarUsuario(id:number){
    var opcion = confirm("¿Estas Seguro que deseas eliminar el Usuario?");
    if (opcion == true) {
    this.usuariosService.delete(id).subscribe(
      (ok)=> this.listarUsuarios(),
      (err) => console.log('fallo'),
    )
    }
  }
  //******  Eliminar las Categorias - Fin ******
//Validaciones
  busquedaCorreo(email:string){ 
    if ((email.length)  >= 5) {
      this.emailExiste = null;

      for (const usuario of this.usuarios) {
        if (usuario.email === email) {
          this.emailExiste = true;
          console.log('existe');
        } 
      }
      if (this.emailExiste !== true) {
          console.log('Nooooooo existe');
          this.emailExiste = null;
      } 
    }
  }
  busquedaUsuario(Usuario:string){ 
    if ((Usuario.length)  >= 5) {
      this.UsuarioExiste = null;
      this.mostrar= "paraMostrar"
      for (const usuario of this.usuarios) {
        if (usuario.usuario === Usuario) {
          this.UsuarioExiste = true;
          this.mostrar= null
          console.log('existe');
        } 
      }
      if (this.UsuarioExiste !== true) {
          console.log('Nooooooo existe');
          this.UsuarioExiste = null;
          this.mostrar= "paraMostrar"

      } 
    }
  }
  
}
