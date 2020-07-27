import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from 'src/app/components/general/inicio/inicio.component';
import { NosotrosComponent } from 'src/app/components/general/nosotros/nosotros.component';
import { ContactenosComponent } from 'src/app/components/general/contactenos/contactenos.component';
//admin
import { InicioAdminComponent } from 'src/app/components/admin/inicio-admin/inicio-admin.component';
//productos Admin
import { GestionarProductosComponent } from 'src/app/components/admin/productos/gestionar-productos/gestionar-productos.component'
//Categorias Admin
import { GestionarCategoriasComponent } from 'src/app/components/admin/categorias/gestionar-categorias/gestionar-categorias.component';
//mesas Admin
import { GestionarMesasComponent } from 'src/app/components/admin/mesas/gestionar-mesas/gestionar-mesas.component'; 
//clientes Admin
import { GestionarUsuariosComponent } from 'src/app/components/admin/usuarios/gestionar-usuarios/gestionar-usuarios.component';
// reservas Admin
import { GestionarReservasComponent } from 'src/app/components/admin/reservas/gestionar-reservas/gestionar-reservas.component';
//validar Token
import { ValidarTokenComponent } from 'src/app/components/general/validarToken/validar-token/validar-token.component'
//Reservas
import { ReservasComponent } from 'src/app/components/general/reservas/reservas.component';
//confirmacion
import { ConfirmacionComponent } from 'src/app/components/general/confirmacion/confirmacion/confirmacion.component';
//reportes
import { ReportesComponent } from 'src/app/components/admin/reportes/reportes.component'
//Cambiar Contrasenia
import { CambiarContraseniaComponent } from 'src/app/components/general/cambiar-contrasenia/cambiar-contrasenia.component';
//Guards
import { LogueoGuard } from 'src/app/guards/logueo.guard'
import { LogueoCilenteGuard } from 'src/app/guards/logueo-cilente.guard' 
const routes: Routes = [  
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'nosotros',
    component: NosotrosComponent
  },
  {
    path: 'cambioContrasenia',
    component: CambiarContraseniaComponent
  },
  {
    path: 'contactenos',
    component: ContactenosComponent
  },
  { path: 'admin', component: InicioAdminComponent, canActivate: [LogueoGuard] ,
    children: [
      
      {
        path: 'productos',
        component: GestionarProductosComponent,
      },
      {
        path: 'categorias',
        component: GestionarCategoriasComponent,
      },
      {
        path: 'mesas',
        component: GestionarMesasComponent,
      },
      {
        path: 'usuarios',
        component: GestionarUsuariosComponent,
      },
      {
        path: 'reservas',
        component: GestionarReservasComponent,
      },{
        path: 'reportes',
        component: ReportesComponent,
      },
      { path: '', 
        redirectTo: 'productos',
        pathMatch: 'full'
      },
      
    ]
  },
  { path: 'validarToken',
    children: [
      {path: ':id',
      component: ValidarTokenComponent,
    },
    ]
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [LogueoCilenteGuard],
  },
  {
    path: 'confirmacionReserva',
    children: [
      {path: ':id',
      component: ConfirmacionComponent,
    },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }