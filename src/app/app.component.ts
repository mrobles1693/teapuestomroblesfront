import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {BackService } from "./back-service.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fcTipoRuta = new FormControl<any>(null, [Validators.required]);
  fcOrigen = new FormControl<any>(null, [Validators.required]);
  fcDestino = new FormControl<any>(null, [Validators.required]);
  fcProgramacion = new FormControl<any>(null, [Validators.required]);
  fcCantidad = new FormControl<any>(null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]);
  bReservar = true;

  constructor(
    private service : BackService,
    private spinner : NgxSpinnerService,
  ){
    this.fnIniciarFormReserva();
  }

  fnIniciarFormReserva(){
    this.fcDestino.disable();
    this.fcProgramacion.disable();
    this.fcCantidad.disable();
  }

  fnChangeOrigen(){
    this.fcDestino.setValue(null);
    this.fcProgramacion.setValue(null);
    this.fcCantidad.setValue(null);

    this.fcDestino.enable();
    this.fcProgramacion.disable();
    this.fcCantidad.disable();
    this.bReservar = true;
  }

  fnChangeDestino(){
    this.fcProgramacion.setValue(null);
    this.fcCantidad.setValue(null);

    this.fcProgramacion.enable();
    this.fcCantidad.disable();
    this.bReservar = true;
  }

  fnChangeProgramacion(){
    this.fcCantidad.setValue(null);

    this.fcCantidad.enable();
    this.bReservar = true;
  }

  fnChangeCantidad(){
    this.bReservar = false;
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

  isValidFormReserva(){
    this.fcTipoRuta.markAsTouched();
    this.fcOrigen.markAsTouched();
    this.fcDestino.markAsTouched();
    this.fcProgramacion.markAsTouched();
    this.fcCantidad.markAsTouched();

    if(this.isInvalidFc(this.fcTipoRuta)) return false;
    if(this.isInvalidFc(this.fcOrigen)) return false;
    if(this.isInvalidFc(this.fcDestino)) return false;
    if(this.isInvalidFc(this.fcProgramacion)) return false;
    if(this.isInvalidFc(this.fcCantidad)) return false;

    return true;
  }
}
