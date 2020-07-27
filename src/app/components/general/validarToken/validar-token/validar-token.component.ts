import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-validar-token',
  templateUrl: './validar-token.component.html',
  styleUrls: ['./validar-token.component.css']
})
export class ValidarTokenComponent implements OnInit {
  formToken = new FormGroup({
    Token: new FormControl(''),
  });
  //******  Actualizar las Categorias - Inicio ******
  usuario: any;
  //******  Actualizar las Categorias - Fin ******
  emailExiste: boolean = false
  texto: any='';
  constructor(
    private usuariosService:UsuariosService,
    private route: ActivatedRoute,
    private router: Router,

    ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerUsuario(+id);
  }
  obtenerUsuario(id:number){
    this.usuariosService.get(id).subscribe(
      dato => this.usuario = dato,
      err => console.log(err),
    );
  }
  
  validarToken(){
    if (this.usuario.token === this.formToken.controls['Token'].value) {
      this.usuario.token = null;
      this.usuariosService.update(this.usuario,this.usuario.id).subscribe(
        ok => {
          this.usuariosService.get(this.usuario.id).subscribe(
              data => {
                if(JSON.parse(localStorage.getItem('DatosUsuarioLogueado'))){
                  localStorage.removeItem('DatosUsuarioLogueado')
                  localStorage.setItem("DatosUsuarioLogueado",JSON.stringify(data))   
                } else {
                  localStorage.setItem("DatosUsuarioLogueado",JSON.stringify(data))   
                }
                     
              },
              err => console.log(err),
              ()=> this.router.navigate(['/reservas'])

            )
          console.log('actualizado')
        },
        err => console.log(err),
                      
      );
      console.log('funciona');
    } else{
      console.log('emailExiste');
      this.emailExiste = true
    } 
   }
  
   limpiar(textoIntroducido){
     this.texto=textoIntroducido  
      if(this.texto.length <=6){
      this.emailExiste = false
    }
  }
}
