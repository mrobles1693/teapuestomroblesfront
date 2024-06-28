import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {BackService } from "./back-service.service";
import {NgxSpinnerService} from "ngx-spinner";
import { lastValueFrom } from 'rxjs';
import { CiudadDTO } from './interfaces/CiudadDTO';
import { getPrecioProgramacioVueloDTO, ProgramacionVueloDTO, searchProgramacionVueloDTO } from './interfaces/ProgramacionVueloDTO';
import { FormPasajeroDTO, InsReservaDTO } from './interfaces/ReservaDTO';
import { ApiResponse } from './interfaces/ApiResponse';
import { SqlRspDTO } from './interfaces/SqlRspDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  listOrigen : CiudadDTO[] = [];
  listDestino : CiudadDTO[] = [];
  listProgramacionIda : ProgramacionVueloDTO[] = [];
  listProgramacionVuelta : ProgramacionVueloDTO[] = [];

  listFormularioPasajero : FormPasajeroDTO[] = [];
  cantDisp = 0;

  nIdReserva : number | null = null;

  fcTipoRuta = new FormControl<any>(null, [Validators.required]);
  fcOrigen = new FormControl<any>(null, [Validators.required]);
  fcDestino = new FormControl<any>(null, [Validators.required]);
  fcProgramacionIda = new FormControl<any>(null, [Validators.required]);
  fcProgramacionVuelta = new FormControl<any>(null);
  fcCantidad = new FormControl<any>(null, [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern(/^\d+$/)]);
  fcPrecioFinal = new FormControl<any>(0);
  bReservar = true;

  constructor(
    private service : BackService,
    private spinner : NgxSpinnerService,
  ){
    this.fnIniciarFormReserva();
    this.fnLoadOrigen();
  }

  fnIniciarFormReserva(){
    this.fcOrigen.disable();
    this.fcDestino.disable();
    this.fcProgramacionIda.disable();
    this.fcProgramacionVuelta.disable();
    this.fcCantidad.disable();
    this.fcPrecioFinal.disable();
  }

  fnLimpiarFormReserva(){
    this.fcTipoRuta.setValue(null);
    this.fcOrigen.setValue(null);
    this.fcDestino.setValue(null);
    this.fcProgramacionIda.setValue(null);
    this.fcProgramacionVuelta.setValue(null);
    this.fcCantidad.setValue(null);
    this.fcPrecioFinal.setValue(null);
  }

  //#region LOAD DATA
  async fnLoadOrigen(){
    this.spinner.show();
    await lastValueFrom(this.service.getListOrigen()).then(
      (res) => {
        if(res.success){
          this.listOrigen = res.data;
        }
        this.spinner.hide();
      }
    ).catch(
      err => {
        this.spinner.hide();
        console.log(err.message);
      }
    );
  }
  
  async fnLoadDestino(nIdCiudadOrigen : number){
    this.spinner.show();
    await lastValueFrom(this.service.getListDestino(nIdCiudadOrigen)).then(
      (res) => {
        if(res.success){
          this.listDestino = res.data;
        }
        this.spinner.hide();
      }
    ).catch(
      err => {
        this.spinner.hide();
        console.log(err.message);
      }
    );
  }

  async fnLoadProgramacionIda(search : searchProgramacionVueloDTO){
    this.spinner.show();
    await lastValueFrom(this.service.getListProgramacion(search)).then(
      (res) => {
        if(res.success){
          this.listProgramacionIda = res.data;
        }
        this.spinner.hide();
      }
    ).catch(
      err => {
        this.spinner.hide();
        console.log(err.message);
      }
    );
  }

  async fnLoadProgramacionVuelta(search : searchProgramacionVueloDTO){
    this.spinner.show();
    await lastValueFrom(this.service.getListProgramacion(search)).then(
      (res) => {
        if(res.success){
          this.listProgramacionVuelta = res.data;
        }
        this.spinner.hide();
      }
    ).catch(
      err => {
        this.spinner.hide();
        console.log(err.message);
      }
    );
  }

  async fnLoadPrecioFinal(getPrecio : getPrecioProgramacioVueloDTO){
    this.spinner.show();
    await lastValueFrom(this.service.getPrecioFinal(getPrecio)).then(
      (res) => {
        if(res.success){
          this.fcPrecioFinal.setValue(res.data);
        }
        this.spinner.hide();
      }
    ).catch(
      err => {
        this.spinner.hide();
        console.log(err.message);
      }
    );
  }
  //#endregion

  async fnChageTipoRuta(){
    this.fcOrigen.setValue(null);
    this.fcDestino.setValue(null);
    this.fcProgramacionIda.setValue(null);
    this.fcCantidad.setValue(null);
    this.fcPrecioFinal.setValue(null);

    this.fcOrigen.enable();
    this.fcDestino.disable();
    this.fcProgramacionIda.disable();
    this.fcCantidad.disable();

    this.fcProgramacionVuelta = new FormControl<any>(null);

    if(this.fcTipoRuta.value == 2){
      this.fcProgramacionVuelta = new FormControl<any>(null, [Validators.required]);
      this.fcProgramacionVuelta.setValue(null);
      this.fcProgramacionVuelta.disable();
    }
    
    this.bReservar = true;
  }

  async fnChangeOrigen(){
    this.fcDestino.setValue(null);
    this.fcProgramacionIda.setValue(null);
    this.fcCantidad.setValue(null);
    this.fcPrecioFinal.setValue(null);

    this.fcDestino.enable();
    this.fcProgramacionIda.disable();
    this.fcCantidad.disable();
    
    if(this.fcTipoRuta.value == 2){
      this.fcProgramacionVuelta.setValue(null);
      this.fcProgramacionVuelta.disable();
    }

    this.bReservar = true;

    await this.fnLoadDestino(this.fcOrigen.value);
  }

  async fnChangeDestino(){
    this.fcCantidad.setValue(null);
    this.fcProgramacionIda.setValue(null);
    this.fcPrecioFinal.setValue(null);

    this.fcCantidad.enable();
    this.fcProgramacionIda.disable();

    if(this.fcTipoRuta.value == 2){
      this.fcProgramacionVuelta.setValue(null);
      this.fcProgramacionVuelta.disable();
    }

    this.bReservar = true;
  }

  async fnChangeCantidad(){
    this.fcProgramacionIda.setValue(null);
    this.fcPrecioFinal.setValue(null);

    this.fcProgramacionIda.enable();

    await this.fnLoadProgramacionIda({
      nIdCiudadOrigen : this.fcOrigen.value,
      nIdCiudadDestino : this.fcDestino.value,
      nCantidadPax : this.fcCantidad.value
    });

    if(this.fcTipoRuta.value == 2){
      this.fcProgramacionVuelta.setValue(null);
      this.fcProgramacionVuelta.enable();
    }

    var count = 1;
    this.listFormularioPasajero = [];
    while(count <= this.fcCantidad.value){
      this.listFormularioPasajero.push({
        nIdReservaPasajero : null,
        fcDNI : new FormControl(null, [Validators.required, Validators.pattern(/^([0-9]){8}$/)]),
        fcPasaporte : new FormControl(null, [Validators.required, Validators.maxLength(11)]),
        fcApellidoP : new FormControl(null, [Validators.required]),
        fcApellidoM : new FormControl(null, [Validators.required]),
        fcPriNombre : new FormControl(null, [Validators.required]),
        fcSegNombre : new FormControl(null),
        fcCelular : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(11), Validators.pattern(/^([0-9])*$/)]),
        fcCorreo : new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
        fcFechaNacimiento : new FormControl(null, [Validators.required]),
      })
      count++;
    }

    this.bReservar = true;
  }

  async fnChangeProgramacionIda(){
    this.bReservar = true;
    this.fcPrecioFinal.setValue(null);

    if(this.fcTipoRuta.value == 1){
      this.bReservar = false;

      await this.fnLoadPrecioFinal({
        nCantidadPax : this.fcCantidad.value,
        nIdProgramacionVueloIda : this.fcProgramacionIda.value
      });
    }

    if(this.fcTipoRuta.value == 2){
      this.fcProgramacionVuelta.setValue(null);
      this.fcProgramacionVuelta.enable();

      await this.fnLoadProgramacionVuelta({
        nIdCiudadOrigen : this.fcDestino.value,
        nIdCiudadDestino : this.fcOrigen.value,
        nCantidadPax : this.fcCantidad.value,
        nIdProgramacionVueloIda : this.fcProgramacionIda.value
      });
    }
  }

  async fnChangeProgramacionVuelta(){
    this.bReservar = false;

    await this.fnLoadPrecioFinal({
      nCantidadPax : this.fcCantidad.value,
      nIdProgramacionVueloIda : this.fcProgramacionIda.value,
      nIdProgramacionVueloVuelta : this.fcProgramacionVuelta.value,
    });
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
    this.fcCantidad.markAsTouched();
    this.fcProgramacionIda.markAsTouched();
    this.fcProgramacionVuelta.markAsTouched();

    if(this.isInvalidFc(this.fcTipoRuta)) return false;
    if(this.isInvalidFc(this.fcOrigen)) return false;
    if(this.isInvalidFc(this.fcDestino)) return false;
    if(this.isInvalidFc(this.fcCantidad)) return false;
    if(this.isInvalidFc(this.fcProgramacionIda)) return false;
    if(this.isInvalidFc(this.fcProgramacionVuelta)) return false;

    return true;
  }

  async fnReserva(){
    if(this.isValidFormReserva()){
      var reserva : InsReservaDTO = { 
        nCantidadPax : this.fcCantidad.value
        ,nIdProgramacionVueloIda : this.fcProgramacionIda.value
        ,nIdProgramacionVueloVuelta : this.fcProgramacionVuelta.value
      }

      this.spinner.show();
      await lastValueFrom(this.service.postInsReserva(reserva)).then(
        (res) => {
          if(res.success){
            this.nIdReserva = res.data.nCod
            this.fnIniciarFormReserva();
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

  async fnCancelar(){
    this.spinner.show();
    await lastValueFrom(this.service.cancelarReserva(this.nIdReserva!)).then(
      (res) => {
        if(res.success){
          this.nIdReserva = null;
          this.fnLimpiarFormReserva();
          this.fnIniciarFormReserva();
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

  async fnFinalizarReserva(){
    var invalidPasajeros = 0;
    var errados = 'Falta completar datos de los pasajeros: ';
    this.listFormularioPasajero.forEach(
      (f, i) => {
        if(f.nIdReservaPasajero == null || f.nIdReservaPasajero == undefined) {
          invalidPasajeros++;
          errados += ' ' + (i+1) + ' -'
        }
      }
    )

    errados = errados.substring(0, errados.length-1);

    if(invalidPasajeros == 0)
    {
      this.spinner.show();
      await lastValueFrom(this.service.finalizarReserva(this.nIdReserva!)).then(
        (res) => {
          if(res.success){
            this.nIdReserva = null;
            this.fnLimpiarFormReserva();
            this.fnIniciarFormReserva();
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
    else
    {
      Swal.fire({
        icon: 'error',
        text: errados,
      });
    }
  }

  fnMostrarRespuesta(res : ApiResponse<SqlRspDTO>){
    Swal.fire({
      icon: res.success ? 'success' : 'error',
      text: res.data.sMsj,
    });
  }
}
