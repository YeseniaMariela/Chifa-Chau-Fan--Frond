import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
import { ActivatedRoute, Router } from '@angular/router';


//enviar Token
import { EnvioTokenService } from 'src/app/services/email/envioToken/envio-token.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {
  formToken = new FormGroup({
    Token: new FormControl(''),
  });
  ingresoToken= new FormGroup({
    Token: new FormControl(''),
  });

  formcontras =  new FormGroup({
    contraAnterior: new FormControl(''),
    contraActu: new FormControl(''),
    contraActu2: new FormControl(''),
  });
  usuarios: any;
  usuarioEncontrado: any;
  existeUsuario: boolean=false;
    //envioTOken
  envioToken:any = {};
  codigo: any;
  validarContra: boolean=false;
  tokenValid: boolean = false;
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

  constructor(
    private usuariosService:UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private envioTokenService: EnvioTokenService,

  ) { }

  ngOnInit() {
    this.codigo = JSON.parse(localStorage.getItem('codigo'))
    this.listarUsuarios();
  }

  listarUsuarios(){
    this.usuariosService.list()
    .subscribe(data => this.usuarios = data,
                 err => console.error(err),
                 ()=>console.log('ok')
                 
                 );
    ;             
  }
  validarExistenciaUsuario(){
    for (const usuario of this.usuarios) {
      if(usuario.email === this.formToken.controls['Token'].value ||
        usuario.usuario === this.formToken.controls['Token'].value){
          this.existeUsuario = true;
          this.usuarioEncontrado = usuario;
          this.tokenValid = true
      }
    }

    if (this.existeUsuario === true) {
      var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
      var contrasenia = "";
      for (let i=0; i<6; i++) contrasenia +=caracteres.charAt(Math.floor(Math.random()*caracteres.length));

      this.envioToken.email = this.usuarioEncontrado.email
      this.envioToken.name = this.usuarioEncontrado.nombre
      this.envioToken.token = contrasenia
      localStorage.setItem("codigo",JSON.stringify(contrasenia) )
      this.envioTokenService.create(this.envioToken).subscribe(
        ok => console.log(ok),
        err => console.log(err),
        () => {
         console.log('Se mando');
         
        }
      )
    }
  }

  validarCodigo(){
    if(JSON.parse(localStorage.getItem('codigo')) === this.ingresoToken.controls['Token'].value){
      console.log("Son Iguales");
      localStorage.removeItem('codigo')
      this.codigo= ""
      this.validarContra = true;
      this.tokenValid = false;
    }
    else{
      console.log('Codigo Errado');
      
    }
  }
  cambiarContrasenia(){
    if(this.usuarioEncontrado.contrasenia ===  this.formcontras.controls['contraAnterior'].value && 
      this.formcontras.controls['contraActu'].value === this.formcontras.controls['contraActu2'].value){
        this.formUsuario.controls['apellidos'].setValue(this.usuarioEncontrado.apellidos);
        this.formUsuario.controls['genero'].setValue(this.usuarioEncontrado.genero);
        this.formUsuario.controls['nombre'].setValue(this.usuarioEncontrado.nombre);
        this.formUsuario.controls['email'].setValue(this.usuarioEncontrado.email);
        this.formUsuario.controls['tipoUsuario'].setValue(this.usuarioEncontrado.tipoUsuario); 
        this.formUsuario.controls['numCelular'].setValue(this.usuarioEncontrado.numCelular);
        this.formUsuario.controls['usuario'].setValue(this.usuarioEncontrado.usuario);
        this.formUsuario.controls['contrasenia'].setValue(this.formcontras.controls['contraActu2'].value);
        this.usuariosService.update(this.formUsuario.value,this.usuarioEncontrado.id).subscribe(
          (ok) => console.log('Se Cambio La contraseña')
          ,
          // this.router.navigate(['/admin/categorias']).then(()=> window.location.reload()),
          (err) => console.log('fallo'),
          () => {
            localStorage.setItem("DatosUsuarioLogueado",JSON.stringify(this.usuarioEncontrado) )
        //Guardar en el local Storage

        if (this.usuarioEncontrado.token !== null) {
          
          this.router.navigate(['/validarToken/' + this.usuarioEncontrado.id])            
          console.log('vale');
          
        } else if(this.usuarioEncontrado.token === null && this.usuarioEncontrado.tipoUsuario === 'CLIENTE')  {
          this.router.navigate(['/reservas'])
        } else if (this.usuarioEncontrado.token === null && this.usuarioEncontrado.tipoUsuario !== 'CLIENTE'){
          
          this.router.navigate(['/admin'])
        }
      
          }
        )

      }
  }
}
