import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EnvioReservaService } from 'src/app/services/email/envioReserva/envio-reserva.service'
import { ReservasService } from 'src/app/services/reservas/reservas.service'
import { GenerarqrService } from 'src/app/services/generarqr/generarqr.service';
export declare let Culqi;

@Injectable({
  providedIn: 'root'
})
export class NgCulqiService {
  token_id: string;
  correo: string;
  settings: any = {
    title: '',
    currency: '',
    description: '',
    amount: 0
  };
  datosReservaRegistrar: any;
  datosMail: any;
  datosEnviarEmail:any[]=[]
  reserva:any
  //generar Qr
  codigoQr: any[]=[];
  constructor(
    private envioReservaService:EnvioReservaService,
    public http: HttpClient,
    private router:Router,
    private reservasService:ReservasService,
    private generarqrService:GenerarqrService
  ) {
    this.initCulqi()

    document.addEventListener ('payment_event', (token: any) => {
      this.token_id = token.detail.id;
      this.correo = token.detail.email;
      let url = 'https://api.culqi.com/v2/charges';
      
      let headers = new HttpHeaders ()
          .set ('Content-Type', 'application/json')
          .set ('Authorization', 'Bearer sk_test_O8uIE4Twy1Zz1oVi');
      console.log(token)
      
      let body = JSON.stringify ({
        amount: this.settings.amount,
        currency_code: "PEN",
        email: this.correo,
        source_id: this.token_id
      });
  
      this.http.post (url, body, {headers: headers}).subscribe (
        response => {
          // Si el pago se realiza, disparamos este evento
          this.reservasService.create(this.datosReservaRegistrar).subscribe(
            data => this.reserva = data,
            err => console.log(err),
            () => {
              console.log('entro1');
              this.codigoQr=[]
              this.datosMail.qrcode = this.reserva.id
              this.codigoQr.push({codigo: this.reserva.id})
              this.generarqrService.create(this.codigoQr[0]).subscribe(
                (ok) => {
                  console.log(ok);
                  
                },
                err => console.log(err),
                () => {
                  this.envioReservaService.create(this.datosMail).subscribe((ok) => console.log(ok),
                  err => console.log(err),
                  () => {
                    this.router.navigate(['/confirmacionReserva/'+ this.reserva.id])
                    console.log('todo ve')}
                  ) 
                }
              )
                        
            }
            
          );
          
          
        }, error => {
          // Si el pago tiene algun error, disparamos otro evento con el error
          console.log(error);
          
        });
  
    },false);
  }
  
    initCulqi() {
        Culqi.publicKey  = "pk_test_7bd276447c510cbe"
      }
  
    payorder(description: string, amount: number,datosReserva:any,datosEmailEnvio: any) {
      this.settings.title = 'La Pergola Restaurant';
      this.settings.currency = "PEN";
      this.settings.description = description;
      this.settings.amount = amount*100;
      this.datosReservaRegistrar = datosReserva;
      this.datosMail = datosEmailEnvio;
      console.log(this.datosMail);
  
      // Culqi.publicKey  = "pk_test_7bd276447c510cbe"
  
  
      Culqi.settings ({
        title: 'Chifa Chau Fan',
        currency: 'PEN',
        description: description,
        amount: amount*100
      });
  
    //   Culqi.options({
    //     lang: 'auto',
    //     modal: true,
    //     installments: false,
    //     style: {
    //       logo:
    //         'assets/logo.png',
    //       maincolor: '#ff0012',
    //       buttontext: '#ffffff',
    //       maintext: '#4A4A4A',
    //       desctext: '#4A4A4A'
    //     }
    // });
    
    Culqi.open();
  
    }
  
    open () {
      Culqi.open();
    }
  
}
