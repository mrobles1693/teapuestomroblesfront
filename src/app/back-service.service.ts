import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/ApiResponse';
import { SqlRspDTO } from 'src/app/interfaces/SqlRspDTO';
import { getBackUrl } from 'src/main';
import { CiudadDTO } from './interfaces/CiudadDTO';
import { InsPasajeroDTO, InsReservaDTO } from './interfaces/ReservaDTO';
import { ProgramacionVueloCantDTO, ProgramacionVueloDTO, searchProgramacionVueloDTO } from './interfaces/ProgramacionVueloDTO';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  urlRuta = '';
  urlReserva = '';

  constructor(
    private http : HttpClient
  ) { 
    this.urlRuta = `${getBackUrl()}Ruta/`;
    this.urlReserva = `${getBackUrl()}Reserva/`;
  }

  getListOrigen(): Observable<ApiResponse<CiudadDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.get<ApiResponse<CiudadDTO[]>>(`${this.urlRuta}getListOrigen`, {headers: httpHeader});
  }

  getListDestino(nIdCiudadOrigen : number): Observable<ApiResponse<CiudadDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    const httpParams = new HttpParams()
    .append('nIdCiudadOrigen', nIdCiudadOrigen);
    return this.http.get<ApiResponse<CiudadDTO[]>>(`${this.urlRuta}getListDestino`, {headers: httpHeader, params: httpParams});
  }

  getListProgramacion(elemento : searchProgramacionVueloDTO): Observable<ApiResponse<ProgramacionVueloDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<ProgramacionVueloDTO[]>>(`${this.urlRuta}getListProgramacion`, elemento, {headers: httpHeader});
  }

  getDisponibilidadAsientos(nIdProgramacionVuelo : number): Observable<ApiResponse<ProgramacionVueloCantDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    const httpParams = new HttpParams()
    .append('nIdProgramacionVuelo', nIdProgramacionVuelo);
    return this.http.get<ApiResponse<ProgramacionVueloCantDTO>>(`${this.urlRuta}getDisponibilidadAsientos`, {headers: httpHeader, params: httpParams});
  }

  postInsReserva(elemento : InsReservaDTO): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<SqlRspDTO>>(`${this.urlReserva}postInsReserva`, elemento, {headers: httpHeader});
  }

  postInsPasajero(elemento : InsPasajeroDTO): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<SqlRspDTO>>(`${this.urlReserva}postInsPasajero`, elemento, {headers: httpHeader});
  }
}
