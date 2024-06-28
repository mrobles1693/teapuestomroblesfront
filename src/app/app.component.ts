import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {BackService } from "./back-service.service";
import {NgxSpinnerService} from "ngx-spinner";
import { lastValueFrom } from 'rxjs';
import { CiudadDTO } from './interfaces/CiudadDTO';
import { ProgramacionVueloDTO, searchProgramacionVueloDTO } from './interfaces/ProgramacionVueloDTO';
import { InsReservaDTO } from './interfaces/ReservaDTO';
import { ApiResponse } from './interfaces/ApiResponse';
import { SqlRspDTO } from './interfaces/SqlRspDTO';

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
  cantDisp = 0;

  nIdReservaIda : number | null = null;
  nIdReservaVuelta : number | null = null;

  fcTipoRuta = new FormControl<any>(null, [Validators.required]);
  fcOrigen = new FormControl<any>(null, [Validators.required]);
  fcDestino = new FormControl<any>(null, [Validators.required]);
  fcProgramacionIda = new FormControl<any>(null, [Validators.required]);
  fcProgramacionVuelta = new FormControl<any>(null);
  fcCantidad = new FormControl<any>(null, [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern(/^\d+$/)]);
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
  }

  //#region LOAD DATA
  async fnLoadOrigen(){
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
  //#endregion

  async fnChageTipoRuta(){
    this.fcOrigen.setValue(null);
    this.fcDestino.setValue(null);
    this.fcProgramacionIda.setValue(null);
    this.fcCantidad.setValue(null);

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

    this.bReservar = true;
  }

  async fnChangeProgramacionIda(){
    this.bReservar = true;

    if(this.fcTipoRuta.value == 1){
      this.bReservar = false;
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

  fnChangeProgramacionVuelta(){
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
        nIdProgramacionVuelo : this.fcProgramacionIda.value
        ,nCantidadPax : this.fcCantidad.value
      }

      this.spinner.show();
      await lastValueFrom(this.service.postInsReserva(reserva)).then(
        (res) => {
          if(res.success){
            this.nIdReservaIda = res.data.nCod
          }
          this.spinner.hide();
        }
      ).catch(
        err => {
          this.spinner.hide();
          console.log(err.message);
        }
      );

      if(this.fcTipoRuta.value == 2){
        reserva.nIdProgramacionVuelo = this.fcProgramacionVuelta.value;

        this.spinner.show();
        await lastValueFrom(this.service.postInsReserva(reserva)).then(
          (res) => {
            if(res.success){
              this.nIdReservaVuelta = res.data.nCod
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
    }
  }
}
