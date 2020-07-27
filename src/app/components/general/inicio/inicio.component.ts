import { Component, OnInit ,TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'

//enviar Token
import { EnvioTokenService } from 'src/app/services/email/envioToken/envio-token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  modalRef: BsModalRef;
    //Usuarios
    usuarios:any[];
    usuario: any;
    generoUsuario:string = "MASCULINO";
    emailExiste:boolean
    emailValido:boolean
    UsuarioExiste:boolean;
    accesoUsuario:boolean
    //usuarui que retorba al crear un usuarui
    usuarioCreado:any;
  //envioTOken
  envioToken:any = {};
  //Formulario
  formUsuario = new FormGroup({ 
    apellidos: new FormControl(''),
    nombre: new FormControl(''),
    genero: new FormControl('MASCULINO'),
    tipoUsuario: new FormControl(''),
    email: new FormControl(''),
    numCelular: new FormControl(''),
    usuario: new FormControl(''),
    contrasenia: new FormControl(''),
    contraseniaConfirmar: new FormControl(''),
    token: new FormControl(''),
  });
    //Formulario 2
    formLogin = new FormGroup({ 
      usuario: new FormControl(''),
      contrasenia: new FormControl(''),
    });
  // Disenio
  mostrar:any
  valContrasenia:boolean 
    //validacion logueo
  usuarioLogueado: any;
  mostrarMensaje:boolean = false;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private envioTokenService: EnvioTokenService,
    private usuariosService:UsuariosService,

  ) {
    this.getButtonSelected();}

 
  buttonSelected: any;
  slides: any[] = [
    {
      title: 'Bienvenido a ',
      image: 'slide1.jpg',
      description: 'Chifa Chau Fan',
      alt: 'first slide'
    },
    {
      title: 'Bienvenido a ',
      image: 'slide2.jpg',
      description: 'Chifa Chau Fan',
      alt: 'second slide'
    },
    {
      title: 'Bienvenido a ',
      image: 'slide3.jpg',
      description: 'Chifa Chau Fan',
      alt: 'third slide'
    },
  ];

  buttons: any[] = [
    {
      id: 'login',
      title: 'Iniciar Sesión',
      active: true
    },
    {
      id: 'singup',
      title: 'Registrarse',
      active: false
    }
  ];


  ngOnInit() {
    this.usuarioLogueado = JSON.parse(localStorage.getItem('DatosUsuarioLogueado'));
    console.log('usuario Incio');
    console.log(this.usuarioLogueado);
    //Validacion

    this.listarUsuarios()
  }
  //modales
  getButtonSelected() {
    this.buttonSelected = this.buttons.find(i => i.active);
  }
  openModal(template: TemplateRef<any>) {
    if (this.usuarioLogueado) {
      this.accesoUsuario = true;
        console.log('existe');

        if (this.usuarioLogueado.token !== null) {
          this.router.navigate(['/validarToken/' + this.usuarioLogueado.id])            
          console.log('vale');
          
        } else if(this.usuarioLogueado.token === null && this.usuarioLogueado.tipoUsuario === 'CLIENTE')  {
          this.router.navigate(['/reservas'])
        } else if (this.usuarioLogueado.token === null && this.usuarioLogueado.tipoUsuario !== 'CLIENTE'){
          this.router.navigate(['/admin'])
        }
    } else{
      this.modalService.config.ignoreBackdropClick = true;
      this.modalRef = this.modalService.show(template);
    }

  }
  selectButton(button: any) {
    this.buttons.map(i => i.active = false);
    button.active = true;
    this.getButtonSelected();
  }
  closeModal() {
    this.buttons.map(i => i.active = false);
    this.buttons[0].active = true;
    this.getButtonSelected();
    this.modalRef.hide()
  }

  //Generar Codigo Token
  generarToken(){
    
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

  crearUsuario(){
    var formatoEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    
    if (formatoEmail.test(this.formUsuario.controls['email'].value)){
      this.emailValido = null
      //Crear token
      var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
      var contrasenia = "";
      for (let i=0; i<6; i++) contrasenia +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
  
      this.envioToken.email = this.formUsuario.controls['email'].value
      this.envioToken.name = this.formUsuario.controls['nombre'].value
      this.envioToken.token = contrasenia
      
      this.formUsuario.controls['token'].setValue(contrasenia)
  
      console.log(contrasenia)
      console.log(this.envioToken)
       
      this.formUsuario.controls['tipoUsuario'].setValue('CLIENTE')
      //Creacion Usuario
      console.log(this.formUsuario.value);
      this.usuariosService.create(this.formUsuario.value).subscribe(
        (ok) => {
          this.usuarioCreado = ok;
        },
        (err) => console.log('fallo'),
        ()=> {
          this.envioTokenService.create(this.envioToken).subscribe(
            ok => console.log(ok),
            err => console.log(err),
            () => {
              this.cancelarEdicion();
              this.closeModal() 
              this.router.navigate(['/validarToken/' + this.usuarioCreado.id])
            }
          )
        }
      );
    }else {
      console.log("correo Inválido");
      this.emailValido = true
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
  //******  Agregar las Productos - Fin ******
  //******  Logueo las Usuario - Inicio ******
  logueo(){
    this.accesoUsuario = null;
    console.log(this.formLogin.value);
    
    for (const usuario of this.usuarios) {
      if ((this.formLogin.controls['usuario'].value === usuario.usuario &&
         this.formLogin.controls['contrasenia'].value === usuario.contrasenia) ||
         (this.formLogin.controls['usuario'].value === usuario.email &&
         this.formLogin.controls['contrasenia'].value === usuario.contrasenia)) {
        this.accesoUsuario = true;
        console.log('existe');
        //Guardar en el local Storage
        localStorage.setItem("DatosUsuarioLogueado",JSON.stringify(usuario) )
        //Guardar en el local Storage

        if (usuario.token !== null) {
          this.closeModal() 
          this.router.navigate(['/validarToken/' + usuario.id])            
          console.log('vale');
          
        } else if(usuario.token === null && usuario.tipoUsuario === 'CLIENTE')  {
          this.router.navigate(['/reservas'])
          this.closeModal() 
        } else if (usuario.token === null && usuario.tipoUsuario !== 'CLIENTE'){
          this.closeModal() 
          this.router.navigate(['/admin'])
        }
      }
   }
   if (this.accesoUsuario !== true) {
    console.log('Nooooooo existe');
    this.accesoUsuario = null;
    this.mostrarMensaje = true;
    }  
  }
  //******  Logueo Usuario - Fin ******




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
  confirmarContrasenia(){
    if (this.formUsuario.controls['contrasenia'].value === this.formUsuario.controls['contraseniaConfirmar'].value) {
      this.valContrasenia = true;
      if (this.emailExiste !== true) {
        this.emailExiste = null;
        if (this.UsuarioExiste !== true) {
          this.UsuarioExiste = null;
          this.crearUsuario()
        } else {          
        }
      } else {
      }
    }else{
      console.log('Las contraseñas no coinciden');
      this.valContrasenia = false;
    }
  }
  cambiarContrasenia(){
     
    this.router.navigate(['/cambioContrasenia/'])  
    this.closeModal()
  }
}
