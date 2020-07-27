import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { InicioAdminComponent } from './components/admin/inicio-admin/inicio-admin.component';
import { InicioComponent } from './components/general/inicio/inicio.component';

import { CarouselModule, BsDatepickerModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './components/general/navbar/navbar.component';
import { NosotrosComponent } from './components/general/nosotros/nosotros.component';
import { ContactenosComponent } from './components/general/contactenos/contactenos.component';
import { GestionarProductosComponent } from './components/admin/productos/gestionar-productos/gestionar-productos.component';
import { GestionarCategoriasComponent } from './components/admin/categorias/gestionar-categorias/gestionar-categorias.component';
import { GestionarMesasComponent } from './components/admin/mesas/gestionar-mesas/gestionar-mesas.component';
import { GestionarUsuariosComponent } from './components/admin/usuarios/gestionar-usuarios/gestionar-usuarios.component';
import { ValidarTokenComponent } from './components/general/validarToken/validar-token/validar-token.component';
import { ReservasComponent } from './components/general/reservas/reservas.component';
import { GestionarReservasComponent } from './components/admin/reservas/gestionar-reservas/gestionar-reservas.component';
import { ConfirmacionComponent } from './components/general/confirmacion/confirmacion/confirmacion.component';
import { ReportesComponent } from './components/admin/reportes/reportes.component';
import { CambiarContraseniaComponent } from './components/general/cambiar-contrasenia/cambiar-contrasenia.component';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
 
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("932566860107-1s4d1uv0aahh36ciuqql9b2lv6gaqrjg.apps.googleusercontent.com")
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    InicioAdminComponent,
    InicioComponent,
    NavbarComponent,
    NosotrosComponent,
    ContactenosComponent,
    GestionarProductosComponent,
    GestionarCategoriasComponent,
    GestionarMesasComponent,
    GestionarUsuariosComponent,
    ValidarTokenComponent,
    ReservasComponent,
    GestionarReservasComponent,
    ConfirmacionComponent,
    ReportesComponent,
    CambiarContraseniaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(), 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
