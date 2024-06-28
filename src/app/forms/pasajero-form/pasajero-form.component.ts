import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { BackService } from 'src/app/back-service.service';
import { ApiResponse } from 'src/app/interfaces/ApiResponse';
import { FormPasajeroDTO, InsPasajeroDTO } from 'src/app/interfaces/ReservaDTO';
import { SqlRspDTO } from 'src/app/interfaces/SqlRspDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pasajero-form',
  templateUrl: './pasajero-form.component.html',
  styleUrls: ['./pasajero-form.component.css']
})
export class PasajeroFormComponent {
  @Input() nIdReserva = 0;
  @Input() bPrincipal = false;
  @Input() formPasajero : FormPasajeroDTO | null = null;

  fcTipoDocumento = new FormControl(null, [Validators.required]);
  
  constructor(
    private formDialog : MatDialog,
    private spinner : NgxSpinnerService,
    private service : BackService,
  )
  {
  }

  fnIniciarForm(){
    if(this.formPasajero){
      this.formPasajero.fcDNI = new FormControl(null, [Validators.pattern(/^([0-9]){8}$/)]);
      this.formPasajero.fcPasaporte = new FormControl(null, [Validators.maxLength(11)]);
      this.formPasajero.fcApellidoP = new FormControl(null, [Validators.required]);
      this.formPasajero.fcApellidoM = new FormControl(null, [Validators.required]);
      this.formPasajero.fcPriNombre = new FormControl(null, [Validators.required]);
      this.formPasajero.fcSegNombre = new FormControl(null);
      this.formPasajero.fcCelular = new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(11), Validators.pattern(/^([0-9])*$/)]);
      this.formPasajero.fcCorreo = new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]);
      this.formPasajero.fcFechaNacimiento = new FormControl(null, [Validators.required]);
    }
  }

  getErrorFC(fc : FormControl, msjPattern? : string, minlengt? : number, maxlengt? : number, msjMin? : string,  msjMax? : string){
    return fc.hasError('required') ? 'Campo requerido'
      : fc.hasError('pattern') ? msjPattern
        : fc.hasError('minlength') ? 'Mínimo ' + minlengt + ' caracteres.'
          : fc.hasError('maxlength') ? 'Máximo ' + maxlengt + ' caracteres.'
            : fc.hasError('min') ? msjMin
              : fc.hasError('max') ? msjMax : '';
  }

  isInvalidFc(fc : FormControl){
    return (fc.status == 'INVALID' && fc.touched) ? true : false;
  }  

  isValidForm(){
    this.fcTipoDocumento.markAsTouched();
    this.formPasajero!.fcDNI.markAsTouched();
    this.formPasajero!.fcPasaporte.markAsTouched();
    this.formPasajero!.fcApellidoP.markAsTouched();
    this.formPasajero!.fcApellidoM.markAsTouched();
    this.formPasajero!.fcPriNombre.markAsTouched();
    this.formPasajero!.fcSegNombre.markAsTouched();
    this.formPasajero!.fcCelular.markAsTouched();
    this.formPasajero!.fcCorreo.markAsTouched();
    this.formPasajero!.fcFechaNacimiento.markAsTouched();

    this.fcTipoDocumento.markAsTouched();
    if(this.isInvalidFc(this.formPasajero!.fcDNI)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcPasaporte)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcApellidoP)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcApellidoM)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcPriNombre)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcSegNombre)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcCelular)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcCorreo)) return false;
    if(this.isInvalidFc(this.formPasajero!.fcFechaNacimiento)) return false;

    return true;
  }

  fnChangeDocumento(){
    if(this.fcTipoDocumento.value == 1){
      this.formPasajero!.fcDNI = new FormControl(null, [Validators.required, Validators.pattern(/^([0-9]){8}$/)]);
      this.formPasajero!.fcPasaporte = new FormControl(null, [Validators.maxLength(11)]);
    } else {
      this.formPasajero!.fcDNI = new FormControl(null, [Validators.pattern(/^([0-9]){8}$/)]);
      this.formPasajero!.fcPasaporte = new FormControl(null, [Validators.required, Validators.maxLength(11)]);
    }
  }

  async fnRegistrarPasajero(){
    if(this.isValidForm()){
      const pasajero : InsPasajeroDTO = {
        bPrincipal : this.bPrincipal,
        nIdReserva : this.nIdReserva,
        sDNI : this.formPasajero!.fcDNI.value, 
        sPasaporte : this.formPasajero!.fcPasaporte.value,
        sApellidoP : this.formPasajero!.fcApellidoP.value,
        sApellidoM : this.formPasajero!.fcApellidoM.value,
        sPriNombre : this.formPasajero!.fcPriNombre.value,
        sSegNombre : this.formPasajero!.fcSegNombre.value,
        sCelular : this.formPasajero!.fcCelular.value,
        sCorreo : this.formPasajero!.fcCorreo.value,
        dFechaNacimiento : this.formPasajero!.fcFechaNacimiento.value
      }

      this.spinner.show();
      await lastValueFrom(this.service.postInsPasajero(pasajero)).then(
        (res) => {
          if(res.success){
            this.formPasajero!.nIdReservaPasajero = res.data.nCod;
          }
          this.fnMostrarRespuesta(res);
          this.spinner.hide();
        }
      ).catch(
        err => {
          this.spinner.hide();
          console.log(err.message);
        }
      );
    }
  }

  fnMostrarRespuesta(res : ApiResponse<SqlRspDTO>){
    Swal.fire({
      icon: res.success ? 'success' : 'error',
      text: res.data.sMsj,
    });
  }
}
